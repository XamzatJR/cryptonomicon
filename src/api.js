const API_KEY = "fa2147371ff46aa9dd33a80399caaee4c0ac8ad502a502ed7d08893e764630c1";
const socket = new WebSocket( `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const tickersHandlers = new Map();

socket.addEventListener('message', (e) => {
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);
    if (type !== '5' || newPrice === undefined) {
        return ;
    }
    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice));
});

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage)
        return;
    }
    socket.addEventListener('open', () => {
        socket.send(stringifiedMessage)
    }, {once: true}
    );
}
function subscribeToTickerOnWs(ticker) {
    sendToWebSocket(
        {
            "action": "SubAdd",
            "subs": [`5~CCCAGG~${ticker}~USD`]
        }
    )
}
function unsubscribeFromTickerOnWs(ticker) {
    sendToWebSocket(
        {
            "action": "SubRemove",
            "subs": [`5~CCCAGG~${ticker}~USD`]
        }
    )
}
export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
}
export const unsubscribeFromTicker = (ticker) => {
    tickersHandlers.delete(ticker);
    unsubscribeFromTickerOnWs(ticker);
}
export const fetchCoins = async() => {
    const res = await fetch('https://min-api.cryptocompare.com/data/all/coinlist');
    const fetchedCoins = await res.json();
    return fetchedCoins.Data
}