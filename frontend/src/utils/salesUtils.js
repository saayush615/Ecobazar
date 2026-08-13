export const formatINR = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const CHART_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#14b8a6', '#ec4899', '#f97316', '#06b6d4', '#84cc16',
]

export const STATUS_COLORS = {
  Pending: '#f59e0b',
  Confirmed: '#3b82f6',
  Processing: '#8b5cf6',
  Shipped: '#06b6d4',
  Delivered: '#22c55e',
  Cancelled: '#ef4444',
}

export const PAYMENT_STATUS_COLORS = {
  completed: '#22c55e',
  pending: '#f59e0b',
  failed: '#ef4444',
}

export const PAYMENT_METHOD_COLORS = {
  razorpay: '#8b5cf6',
  cod: '#f59e0b',
}

export const RANGES = [
  { id: '7d', label: '7 Days', days: 7 },
  { id: '30d', label: '30 Days', days: 30 },
  { id: '90d', label: '90 Days', days: 90 },
  { id: 'all', label: 'All Time', days: Infinity },
]

export const filterTrendByRange = (salesTrend = [], rangeId) => {
  const range = RANGES.find((r) => r.id === rangeId)
  if (!range || range.days === Infinity) return salesTrend
  const cutoff = Date.now() - range.days * 24 * 60 * 60 * 1000
  return salesTrend.filter(({ date }) => new Date(`${date}T00:00:00`).getTime() >= cutoff)
}

export const chartTheme = (isDark) => ({
  grid: isDark ? '#374151' : '#e5e7eb',
  axis: isDark ? '#9ca3af' : '#6b7280',
  tooltip: {
    background: isDark ? '#1f2937' : '#ffffff',
    border: isDark ? '#374151' : '#e5e7eb',
    color: isDark ? '#f9fafb' : '#111827',
  },
})

export const tooltipStyle = (t) => ({
  backgroundColor: t.tooltip.background,
  border: `1px solid ${t.tooltip.border}`,
  borderRadius: 8,
  color: t.tooltip.color,
})