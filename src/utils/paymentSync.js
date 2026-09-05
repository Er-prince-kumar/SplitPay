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

export const broadcastPaymentClaimed = async ({ host, trip, payerName, amount, utr }) => {
  const payload = {
    type: 'PAYMENT_CLAIMED',
    payerName,
    amount: Number(amount) || 0,
    tripName: trip || 'Trip Split',
    utr: utr || `UTR${Date.now()}`,
    ref: utr || `UTR${Date.now()}`,
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
        'Title': `SplitPay Claim: ${payerName} says paid ₹${amount}`,
        'Priority': 'high',
        'Tags': 'bell,hourglass_flowing_sand'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Remote claim broadcast error:', e);
  }
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
        'Title': `SplitPay Approved: ${payerName} Settled ₹${amount}`,
        'Priority': 'high',
        'Tags': 'white_check_mark,money_with_wings'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Remote sync broadcast error:', e);
  }
};

export const broadcastPaymentRejected = async ({ host, trip, payerName, amount, ref }) => {
  const payload = {
    type: 'PAYMENT_REJECTED',
    payerName,
    amount: Number(amount) || 0,
    tripName: trip || 'Trip Split',
    ref: ref || '',
    timestamp: Date.now()
  };

  try {
    const channel = new BroadcastChannel('splitpay_sync');
    channel.postMessage(payload);
    channel.close();
  } catch (e) {}

  try {
    const topic = getSyncTopic(host, trip);
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      headers: {
        'Title': `SplitPay: Payment claim rejected for ${payerName}`,
        'Priority': 'default',
        'Tags': 'x'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {}
};

export const subscribeToTripSettlement = ({ host, trip, onPaymentSettled, onPaymentClaimed, onPaymentRejected }) => {
  const topic = getSyncTopic(host, trip);
  const sessionStartTime = Date.now();
  const processedEvents = new Set();
  let eventSource = null;
  let broadcastChannel = null;

  const handleIncomingPayload = (parsedPayload) => {
    if (!parsedPayload || !parsedPayload.type || !parsedPayload.timestamp) return;
    if (parsedPayload.timestamp < sessionStartTime - 4000) return;

    const eventKey = `${parsedPayload.type}_${parsedPayload.ref || parsedPayload.utr || ''}_${parsedPayload.payerName || ''}`;
    if (processedEvents.has(eventKey)) return;
    processedEvents.add(eventKey);

    if (parsedPayload.type === 'PAYMENT_CLAIMED' && typeof onPaymentClaimed === 'function') {
      onPaymentClaimed(parsedPayload);
    } else if (parsedPayload.type === 'PAYMENT_SETTLED' && typeof onPaymentSettled === 'function') {
      onPaymentSettled(parsedPayload);
    } else if (parsedPayload.type === 'PAYMENT_REJECTED' && typeof onPaymentRejected === 'function') {
      onPaymentRejected(parsedPayload);
    }
  };

  // 1. Listen to remote SSE across internet (only events happening NOW or in future)
  try {
    eventSource = new EventSource(`https://ntfy.sh/${topic}/sse?since=now`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data && data.message) {
          const parsedPayload = JSON.parse(data.message);
          handleIncomingPayload(parsedPayload);
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
      handleIncomingPayload(event.data);
    };
  } catch (e) {}

  return () => {
    if (eventSource) eventSource.close();
    if (broadcastChannel) broadcastChannel.close();
  };
};
