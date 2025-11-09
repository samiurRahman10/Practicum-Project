// Dashboard functionality
function showAnalytics(type) {
    document.getElementById('sales-view').classList.add('hidden');
    document.getElementById('orders-view').classList.add('hidden');
    document.getElementById('menu-view').classList.add('hidden');
    document.getElementById(`${type}-view`).classList.remove('hidden');
}