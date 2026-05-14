import { TRANSACTION_COLORS, TRANSACTION_LABELS } from '../../lib/constants.js';

function TransactionBadge({ type }) {
  const colors = TRANSACTION_COLORS[type] ?? TRANSACTION_COLORS.venta;
  const label = TRANSACTION_LABELS[type] ?? type;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold
        ${colors.bg} ${colors.text} ${colors.dark_bg} ${colors.dark_text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export default TransactionBadge;
