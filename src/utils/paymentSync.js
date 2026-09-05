/**
 * Real-time Cross-Device Payment Synchronization Engine for SplitPay
 * Uses public SSE (Server-Sent Events) via ntfy.sh + local BroadcastChannel + Storage events.
 * Enables zero-backend, instant, automatic settlement between payer's phone and host's dashboard.
 */

export const getSyncTopic = (host, trip) => {
  const cleanHost = (host || 'organizer').toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanTrip = (trip || 'split').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `splitpay_${cleanHost || 'host'}_${cleanTrip || 'bill'}`.slice(0, 55);
};

export const broadcastPaymentSettled = async ({ host, trip, payerName, amount, ref }) => {
  const payload = {
    type: 'PAYMENT_SETTLED',
    payerName,
    amount: Number(amount) || 0,
    tripName: trip || 'Trip Split',
    ref: ref || `UPI${Date.now()}`,
    timestamp: Date.now()
  };

  // 1. Broadcast to local tabs on same device
  try {
    const channel = new BroadcastChannel('splitpay_sync');
    channel.postMessage(payload);
    channel.close();
  } catch (e) {}

  // 2. Broadcast across the internet to host device via ntfy.sh SSE
  try {
    const topic = getSyncTopic(host, trip);
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: {
        'Title': `SplitPay: ${payerName} Paid ₹${amount}`,
        'Priority': 'high',
        'Tags': 'money_with_wings,white_check_mark'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Remote sync broadcast error:', e);
  }
};

export const subscribeToTripSettlement = ({ host, trip, onPaymentSettled }) => {
  const topic = getSyncTopic(host, trip);
  const sessionStartTime = Date.now();
  const processedRefs = new Set();
  let eventSource = null;
  let broadcastChannel = null;

  // 1. Listen to remote SSE across internet (only events happening NOW or in future; ?since=now avoids replaying last 12 hours)
  try {
    eventSource = new EventSource(`https://ntfy.sh/${topic}/sse?since=now`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.message) {
          const parsedPayload = JSON.parse(data.message);
          if (
            parsedPayload &&
            parsedPayload.type === 'PAYMENT_SETTLED' &&
            parsedPayload.timestamp &&
            parsedPayload.timestamp >= sessionStartTime - 3000
          ) {
            if (parsedPayload.ref && processedRefs.has(parsedPayload.ref)) {
              return;
            }
            if (parsedPayload.ref) processedRefs.add(parsedPayload.ref);
            onPaymentSettled(parsedPayload);
          }
        }
      } catch (err) {}
    };
  } catch (e) {
    console.warn('SSE subscription error:', e);
  }

  // 2. Listen to local broadcast channel (only fresh events)
  try {
    broadcastChannel = new BroadcastChannel('splitpay_sync');
    broadcastChannel.onmessage = (event) => {
      if (
        event.data &&
        event.data.type === 'PAYMENT_SETTLED' &&
        event.data.timestamp &&
        event.data.timestamp >= sessionStartTime - 3000
      ) {
        if (event.data.ref && processedRefs.has(event.data.ref)) {
          return;
        }
        if (event.data.ref) processedRefs.add(event.data.ref);
        onPaymentSettled(event.data);
      }
    };
  } catch (e) {}

  return () => {
    if (eventSource) eventSource.close();
    if (broadcastChannel) broadcastChannel.close();
  };
};
