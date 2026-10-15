import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Fuel, Gauge, ShieldCheck, Zap } from "lucide-react";

const MIN_DOWN_PAYMENT = 50_000;
const DOWN_PAYMENT_STEP = 10_000;
const TENURE_TICKS = [1, 2, 3, 4, 5, 6, 7];
const RATE_TICKS = [7.5, 9, 10.5, 12, 14];
const TICK_COUNT = 32;

const GAUGE = {
  width: 300,
  height: 210,
  cx: 150,
  cy: 105,
  radius: 140,
  startAngle: 135,
  sweepAngle: 270,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));

const snapToStep = (value, min, max, step) => {
  const safeValue = clamp(value, min, max);
  const snapped = min + Math.round((safeValue - min) / step) * step;
  return Number(clamp(snapped, min, max).toFixed(step < 1 ? 2 : 0));
};

const polarPoint = (radius, angleDegrees) => {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: GAUGE.cx + radius * Math.cos(radians),
    y: GAUGE.cy + radius * Math.sin(radians),
  };
};

const GAUGE_ARC = (() => {
  const start = polarPoint(GAUGE.radius, GAUGE.startAngle);
  const end = polarPoint(GAUGE.radius, GAUGE.startAngle + GAUGE.sweepAngle);
  return `M ${start.x} ${start.y} A ${GAUGE.radius} ${GAUGE.radius} 0 1 1 ${end.x} ${end.y}`;
})();

// Precompute tick geometry once instead of on every gauge render.
const GAUGE_ARC_LENGTH = GAUGE.radius * ((GAUGE.sweepAngle * Math.PI) / 180);

const GAUGE_TICKS = Array.from({ length: TICK_COUNT + 1 }, (_, index) => {
  const ratio = index / TICK_COUNT;
  const angle = GAUGE.startAngle + GAUGE.sweepAngle * ratio;
  const major = index % 4 === 0;
  return {
    ratio,
    major,
    inner: polarPoint(GAUGE.radius + (major ? 5 : 7), angle),
    outer: polarPoint(GAUGE.radius + (major ? 13 : 10), angle),
  };
});

const formatNumber = (value, decimals = 0) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });

const formatRateTick = (value) => formatNumber(value, 2);
const formatDownPaymentTick = (value) => `${formatNumber(value / 100_000, 1)}L`;

const getMaxDownPayment = (price) =>
  Math.max(
    MIN_DOWN_PAYMENT,
    Math.floor((price * 0.7) / DOWN_PAYMENT_STEP) * DOWN_PAYMENT_STEP,
  );

const getInitialDownPayment = (price) =>
  snapToStep(
    Math.round((price * 0.2) / DOWN_PAYMENT_STEP) * DOWN_PAYMENT_STEP,
    MIN_DOWN_PAYMENT,
    getMaxDownPayment(price),
    DOWN_PAYMENT_STEP,
  );

const getDownPaymentTicks = (max) => {
  const values = Array.from({ length: 5 }, (_, index) =>
    snapToStep(
      MIN_DOWN_PAYMENT + ((max - MIN_DOWN_PAYMENT) * index) / 4,
      MIN_DOWN_PAYMENT,
      max,
      DOWN_PAYMENT_STEP,
    ),
  );
  return [...new Set(values)];
};

function RollingNumber({ value, decimals = 0 }) {
  const formatted = formatNumber(value, decimals);

  return (
    <span
      className="inline-flex whitespace-nowrap tabular-nums"
      aria-label={formatted}
    >
      {Array.from(formatted, (character, index) => {
        if (character < "0" || character > "9") {
          return (
            <span key={`separator-${index}`} aria-hidden="true">
              {character}
            </span>
          );
        }

        const digit = Number(character);
        return (
          <span
            key={`digit-${index}`}
            className="inline-block h-[1em] overflow-hidden align-bottom"
            aria-hidden="true"
          >
            <motion.span
              className="flex flex-col"
              initial={false}
              animate={{ y: `-${digit}em` }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{ lineHeight: 1 }}
            >
              {Array.from({ length: 10 }, (_, number) => (
                <span key={number} className="block h-[1em] leading-[1em]">
                  {number}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

const MemoRollingNumber = memo(RollingNumber);

function EditableGaugeNumber({
  title,
  value,
  min,
  max,
  step,
  onChange,
  inputKind = "integer",
  decimals = 0,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEditing = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const commit = () => {
    const parsed = Number(draft.replace(/,/g, "").trim());
    onChange(
      snapToStep(Number.isFinite(parsed) ? parsed : value, min, max, step),
    );
    setEditing(false);
  };

  const handleDraftChange = (nextDraft) => {
    setDraft(nextDraft);
    const cleaned = nextDraft.replace(/,/g, "").trim();
    if (!cleaned || cleaned === "." || cleaned === "-") return;

    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) onChange(clamp(parsed, min, max));
  };

  if (editing) {
    return (
      <input
        autoFocus
        type="text"
        inputMode={inputKind === "decimal" ? "decimal" : "numeric"}
        aria-label={`Edit ${title}`}
        value={draft}
        onChange={(event) => handleDraftChange(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setDraft(String(value));
            setEditing(false);
          }
        }}
        className="w-full min-w-0 border-0 border-b border-blue-500 bg-transparent px-0 text-center font-bold tracking-tight text-slate-900 outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className="inline-flex max-w-full justify-center border-b border-slate-300 px-1 pb-1 font-bold tracking-tight text-slate-900 transition-colors hover:border-blue-500 focus-visible:outline-none focus-visible:border-blue-500"
      title="Click to edit this value"
      aria-label={`Selected ${title}: ${formatNumber(value, decimals)}. Click to edit.`}
    >
      <MemoRollingNumber value={value} decimals={decimals} />
    </button>
  );
}

function CapsuleStepper({ value, min, max, step, onChange, label }) {
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="mt-1 flex w-full justify-center">
      <div className="inline-flex items-center overflow-hidden rounded-full border border-slate-200/80 bg-slate-50/90 px-1 py-0.5 shadow-2xs">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(snapToStep(value - step, min, max, step))}
          disabled={atMin}
          aria-label={`Decrease ${label}`}
          className="flex h-5 w-7 items-center justify-center rounded-full text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          −
        </motion.button>
        <span className="mx-0.5 h-3 w-px bg-slate-200" aria-hidden="true" />
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(snapToStep(value + step, min, max, step))}
          disabled={atMax}
          aria-label={`Increase ${label}`}
          className="flex h-5 w-7 items-center justify-center rounded-full text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

const GaugeMeter = memo(function GaugeMeter({
  title,
  value,
  min,
  max,
  step,
  onChange,
  size = "medium",
  unit,
  majorValues,
  formatTick = String,
  inputKind = "integer",
  decimals = 0,
  currencyPrefix,
  playIntroSweep = false,
  introDone = true,
}) {
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const ratio = clamp((value - min) / (max - min), 0, 1);
  const isSmall = size === "small";

  const updateFromPointer = (event, isStarting = false) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * GAUGE.width;
    const y = ((event.clientY - rect.top) / rect.height) * GAUGE.height;
    const dx = x - GAUGE.cx;
    const dy = y - GAUGE.cy;
    const distance = Math.hypot(dx, dy);

    if (
      isStarting &&
      (distance < GAUGE.radius - 24 || distance > GAUGE.radius + 24)
    ) {
      return;
    }

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    const endAngle = (GAUGE.startAngle + GAUGE.sweepAngle) % 360;
    if (angle > endAngle && angle < GAUGE.startAngle) {
      // Snap within the unused bottom gap to whichever end is nearest.
      angle =
        angle - endAngle <= GAUGE.startAngle - angle
          ? GAUGE.startAngle + GAUGE.sweepAngle
          : GAUGE.startAngle;
    } else if (angle < GAUGE.startAngle) {
      angle += 360;
    }

    angle = clamp(angle, GAUGE.startAngle, GAUGE.startAngle + GAUGE.sweepAngle);
    const pointerRatio = (angle - GAUGE.startAngle) / GAUGE.sweepAngle;
    onChange(snapToStep(min + pointerRatio * (max - min), min, max, step));
  };

  const handlePointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.cancelable) event.preventDefault();
    updateFromPointer(event, true);

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * GAUGE.width;
    const y = ((event.clientY - rect.top) / rect.height) * GAUGE.height;
    if (Math.abs(Math.hypot(x - GAUGE.cx, y - GAUGE.cy) - GAUGE.radius) > 24)
      return;

    dragging.current = true;
    try {
      svg.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can be unavailable in some embedded browsers.
    }
  };

  const handlePointerMove = (event) => {
    if (dragging.current) updateFromPointer(event);
  };

  const handlePointerUp = (event) => {
    dragging.current = false;
    try {
      if (svgRef.current?.hasPointerCapture(event.pointerId)) {
        svgRef.current.releasePointerCapture(event.pointerId);
      }
    } catch {
      // The pointer may already have been released.
    }
  };

  const handleKeyDown = (event) => {
    let nextValue;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      nextValue = value - step;
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      nextValue = value + step;
    } else if (event.key === "Home") {
      nextValue = min;
    } else if (event.key === "End") {
      nextValue = max;
    } else {
      return;
    }

    event.preventDefault();
    onChange(snapToStep(nextValue, min, max, step));
  };

  return (
    <div
      className={`mx-auto w-full select-none outline-none ${isSmall ? "max-w-[260px]" : "max-w-[370px]"}`}
      style={{ outline: "none" }}
    >
      <div className="relative outline-none" style={{ outline: "none" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${GAUGE.width} ${GAUGE.height}`}
          style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
          className="block h-auto w-full select-none touch-none overflow-visible outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-none ring-0"
          role="presentation"
          tabIndex={-1}
          aria-label={title}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <path
            d={GAUGE_ARC}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={isSmall ? 7 : 8}
            strokeLinecap="round"
          />
          <motion.path
            d={GAUGE_ARC}
            fill="none"
            stroke="#2878F0"
            strokeWidth={isSmall ? 6.5 : 7.5}
            strokeLinecap="round"
            strokeDasharray={GAUGE_ARC_LENGTH}
            initial={{ strokeDashoffset: GAUGE_ARC_LENGTH }}
            animate={
              playIntroSweep && !introDone
                ? {
                  strokeDashoffset: [
                    GAUGE_ARC_LENGTH,
                    0,
                    GAUGE_ARC_LENGTH * (1 - ratio),
                  ],
                }
                : { strokeDashoffset: GAUGE_ARC_LENGTH * (1 - ratio) }
            }
            transition={
              playIntroSweep && !introDone
                ? {
                  duration: 1.3,
                  times: [0, 0.45, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
                : { type: "spring", stiffness: 180, damping: 25 }
            }
          />

          {GAUGE_TICKS.map((tick, index) => {
            const passed = tick.ratio <= ratio + 0.0001;
            return (
              <line
                key={index}
                x1={tick.inner.x}
                y1={tick.inner.y}
                x2={tick.outer.x}
                y2={tick.outer.y}
                stroke={passed ? "#5796F5" : "#D8E0EA"}
                strokeWidth={tick.major ? 1.5 : 1.2}
                strokeLinecap="round"
              />
            );
          })}

          {majorValues.map((tick) => {
            const tickRatio = (tick - min) / (max - min);
            const angle = GAUGE.startAngle + GAUGE.sweepAngle * tickRatio;
            const point = polarPoint(GAUGE.radius + 28, angle);
            const passed = tick <= value + 0.00001;

            return (
              <text
                key={tick}
                x={point.x}
                y={point.y}
                fill={passed ? "#243B5A" : "#94A3B8"}
                fontSize={isSmall ? 13 : 14}
                fontWeight={passed ? 700 : 500}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {formatTick(tick)}
              </text>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-[42%] flex -translate-y-1/2 flex-col items-center px-2 text-center">
          <span
            className={`mb-1 font-semibold uppercase text-slate-500 ${isSmall ? "text-[9px] tracking-wide sm:text-[10px]" : "text-[10px] tracking-wide sm:text-xs"}`}
          >
            {title}
          </span>
          <div
            className={`pointer-events-auto flex max-w-full items-baseline justify-center gap-1 ${isSmall ? "text-xl sm:text-[2.1rem]" : "text-xl sm:text-[2.8rem]"}`}
          >
            {currencyPrefix && (
              <span
                className={`shrink-0 font-semibold text-slate-800 ${isSmall ? "text-xl" : "text-2xl"}`}
              >
                {currencyPrefix}
              </span>
            )}
            <div
              className={`min-w-0 ${isSmall ? "max-w-[132px]" : title === "Down Payment" ? "max-w-[210px]" : "max-w-[120px]"}`}
            >
              <EditableGaugeNumber
                title={title}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                inputKind={inputKind}
                decimals={decimals}
              />
            </div>
          </div>
          <span
            className={`mt-1 text-slate-500 ${isSmall ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
          >
            {unit}
          </span>
        </div>
      </div>

      <CapsuleStepper
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        label={title}
      />
    </div>
  );
});

function EditableMobileValue({
  title,
  value,
  min,
  max,
  step,
  onChange,
  currencyPrefix = "",
  unit = "",
  decimals = 0,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEditing = () => {
    setDraft(String(value));
    setEditing(true);
  };

  const commit = () => {
    const cleaned = draft.replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) {
      onChange(snapToStep(parsed, min, max, step));
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 font-bold text-slate-900">
        {currencyPrefix && (
          <span className="text-xs font-semibold text-slate-500">
            {currencyPrefix}
          </span>
        )}
        <input
          autoFocus
          type="text"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          aria-label={`Edit ${title}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              setDraft(String(value));
              setEditing(false);
            }
          }}
          className="w-20 border-b border-blue-600 bg-transparent px-0.5 py-0 text-right text-sm font-bold text-slate-900 outline-none"
        />
        {unit && (
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className="group inline-flex items-baseline gap-1 border-b border-dashed border-slate-300 pb-0.5 text-right font-bold transition-colors hover:border-blue-500"
      title={`Click to edit ${title}`}
      aria-label={`Selected ${title}: ${formatNumber(value, decimals)}. Click to edit.`}
    >
      {currencyPrefix && (
        <span className="text-xs font-semibold text-slate-600">
          {currencyPrefix}
        </span>
      )}
      <span className="text-sm font-bold text-slate-900 tabular-nums">
        <MemoRollingNumber value={value} decimals={decimals} />
      </span>
      {unit && (
        <span className="text-xs font-medium text-slate-500">{unit}</span>
      )}
    </button>
  );
}

function HorizontalLineSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  currencyPrefix = "",
  minLabel,
  maxLabel,
  icons,
  decimals = 0,
}) {
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100),
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            {label}
          </span>
          {icons && (
            <div className="flex items-center gap-1.5 text-slate-400">
              {icons}
            </div>
          )}
        </div>

        {/* Editable value: user can click and type */}
        <EditableMobileValue
          title={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          currencyPrefix={currencyPrefix}
          unit={unit}
          decimals={decimals}
        />
      </div>

      {/* Slim Slider Track Line */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(snapToStep(Number(e.target.value), min, max, step))
          }
          aria-label={label}
          className="slider-line-thumb h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 transition-all focus:outline-none"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />
      </div>

      {/* Smaller min/max markers, NO + / - capsule */}
      <div className="flex items-center justify-between text-[10px] font-medium text-slate-400">
        <span>{minLabel || min}</span>
        <span>{maxLabel || max}</span>
      </div>
    </div>
  );
}

export default function EMICalculator({ car, selectedVariant, currentPrice }) {
  const [downPayment, setDownPayment] = useState(() =>
    getInitialDownPayment(currentPrice),
  );
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);

  // Scroll-triggered intro animation: gauges sweep completely to max and set back once on first scroll / refresh
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const introStartedRef = useRef(false);
  const [introDone, setIntroDone] = useState(false);
  const [playIntroSweep, setPlayIntroSweep] = useState(false);

  useEffect(() => {
    if (isInView && !introStartedRef.current) {
      introStartedRef.current = true;
      setPlayIntroSweep(true);
      const timer = setTimeout(() => {
        setIntroDone(true);
        setPlayIntroSweep(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const handleTenureChange = (val) => {
    if (!introDone) {
      setIntroDone(true);
      setPlayIntroSweep(false);
    }
    setLoanTenureYears(val);
  };

  const handleInterestRateChange = (val) => {
    if (!introDone) {
      setIntroDone(true);
      setPlayIntroSweep(false);
    }
    setInterestRate(val);
  };

  const handleDownPaymentChange = (val) => {
    if (!introDone) {
      setIntroDone(true);
      setPlayIntroSweep(false);
    }
    setDownPayment(val);
  };

  const maxDownPayment = getMaxDownPayment(currentPrice);
  const safeDownPayment = clamp(downPayment, MIN_DOWN_PAYMENT, maxDownPayment);
  const downPaymentTicks = useMemo(
    () => getDownPaymentTicks(maxDownPayment),
    [maxDownPayment],
  );

  useEffect(() => {
    setDownPayment(getInitialDownPayment(currentPrice));
  }, [currentPrice]);

  const loanPrincipal = Math.max(0, currentPrice - safeDownPayment);
  const totalMonths = loanTenureYears * 12;
  const monthlyRate = interestRate / 1200;
  const emi =
    loanPrincipal <= 0
      ? 0
      : monthlyRate === 0
        ? Math.round(loanPrincipal / totalMonths)
        : Math.round(
          (loanPrincipal *
            monthlyRate *
            Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1),
        );
  const totalInterest = Math.max(0, emi * totalMonths - loanPrincipal);

  const handleOpenEmiOffers = () => {
    window.dispatchEvent(
      new CustomEvent("open-emi-offers", {
        detail: {
          car,
          variant: selectedVariant,
          carPrice: currentPrice,
          downPayment: safeDownPayment,
          loanAmount: loanPrincipal,
          tenureYears: loanTenureYears,
          interestRate,
          estimatedEmi: emi,
        },
      }),
    );
  };

  return (
    <section
      ref={sectionRef}
      className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-[0_12px_35px_rgba(15,23,42,0.07)]"
    >
      {/* 1) MOBILE UI (< 768px, 'block md:hidden'):                     */}
      <div className="block md:hidden space-y-5">
        {/* Horizontal Line Controls - clean unboxed layout */}
        <div className="space-y-3.5 divide-y divide-slate-100">
          {/* Down Payment */}
          <div className="pb-3.5">
            <HorizontalLineSlider
              label="Down Payment"
              value={safeDownPayment}
              min={MIN_DOWN_PAYMENT}
              max={maxDownPayment}
              step={DOWN_PAYMENT_STEP}
              onChange={handleDownPaymentChange}
              currencyPrefix="₹"
              minLabel="₹50K"
              maxLabel={`₹${formatDownPaymentTick(maxDownPayment)}`}
            />
          </div>

          {/* Tenure */}
          <div className="pt-3.5 pb-3.5">
            <HorizontalLineSlider
              label="Loan Tenure"
              value={loanTenureYears}
              min={1}
              max={12}
              step={1}
              onChange={handleTenureChange}
              unit="Years"
              minLabel="1 Yr"
              maxLabel="12 Yrs"
            />
          </div>

          {/* Interest Rate */}
          <div className="pt-3.5">
            <HorizontalLineSlider
              label="Interest Rate"
              value={interestRate}
              min={7.5}
              max={30}
              step={0.25}
              onChange={handleInterestRateChange}
              unit="% p.a."
              decimals={2}
              minLabel="7.5%"
              maxLabel="30%"
              icons={
                <>
                  <Fuel className="h-3 w-3" aria-label="Fuel" />
                  <ShieldCheck className="h-3 w-3" aria-label="Safety" />
                  <Zap className="h-3 w-3" aria-label="Engine" />
                  <Gauge className="h-3 w-3" aria-label="Dashboard" />
                </>
              }
            />
          </div>
        </div>

        {/* Information Below It - Clean & Professional (no extra boxy borders) */}
        <div className="space-y-4 pt-3 border-t border-slate-200/80">
          {/* Estimated Monthly EMI */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Estimated Monthly EMI
            </span>
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-lg font-bold text-slate-900">₹</span>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                <MemoRollingNumber value={emi} />
              </span>
              <span className="text-xs font-medium text-slate-500">
                / mo
              </span>
            </div>
          </div>

          {/* Loan Details (clean rows with subtle divider) */}
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">
                Loan Amount
              </span>
              <span className="font-semibold text-slate-800 tabular-nums">
                ₹ <MemoRollingNumber value={loanPrincipal} />
              </span>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  Total Interest
                </span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  ₹ <MemoRollingNumber value={totalInterest} />
                </span>
              </div>
              <p className="mt-0.5 text-right text-[10px] text-slate-400">
                Calculated after down payment*
              </p>
            </div>
          </div>

          {/* Get EMI Offers Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenEmiOffers}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
          >
            Get EMI Offers
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* 2) TAB & DESKTOP UI ('hidden md:flex'):                         */}
      <div className="hidden md:flex md:flex-col lg:grid lg:grid-cols-[72%_28%] lg:gap-4">
        {/* METER SET-UP: UP on Tab, LEFT on Desktop */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end">
          {/* Tenure */}
          <div className="flex min-w-0 flex-col items-center justify-end gap-6 sm:gap-8">
            <div className="mb-1 hidden h-5 md:block" aria-hidden="true" />
            <GaugeMeter
              title="Tenure"
              value={loanTenureYears}
              min={1}
              max={12}
              step={1}
              onChange={handleTenureChange}
              size="small"
              unit="Years"
              majorValues={TENURE_TICKS}
              playIntroSweep={playIntroSweep}
              introDone={introDone}
            />
          </div>

          {/* Rate of Interest (along with icons) */}
          <div className="flex min-w-0 flex-col items-center justify-start gap-8 sm:gap-12 p-2 sm:p-4 md:p-6 lg:p-8">
            {/* Icons */}
            <div className="mb-1 flex h-5 items-start justify-center gap-4 sm:gap-6 text-slate-400">
              <Fuel
                className="h-5 w-5 sm:h-[18px] sm:w-[18px]"
                aria-label="Fuel"
              />
              <ShieldCheck
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                aria-label="Safety"
              />
              <Zap
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                aria-label="Engine"
              />
              <Gauge
                className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                aria-label="Dashboard"
              />
            </div>
            <GaugeMeter
              title="Interest Rate"
              value={interestRate}
              min={7.5}
              max={30}
              step={0.25}
              onChange={handleInterestRateChange}
              size="small"
              unit="% p.a."
              majorValues={RATE_TICKS}
              formatTick={formatRateTick}
              inputKind="decimal"
              decimals={2}
              playIntroSweep={playIntroSweep}
              introDone={introDone}
            />
          </div>

          {/* Down Payment */}
          <div className="flex min-w-0 flex-col items-center justify-end">
            <div className="mb-1 hidden h-5 md:block" aria-hidden="true" />
            <GaugeMeter
              title="Down Payment"
              value={safeDownPayment}
              min={MIN_DOWN_PAYMENT}
              max={maxDownPayment}
              step={DOWN_PAYMENT_STEP}
              onChange={handleDownPaymentChange}
              size="small"
              unit=""
              majorValues={downPaymentTicks}
              formatTick={formatDownPaymentTick}
              currencyPrefix="₹"
              playIntroSweep={playIntroSweep}
              introDone={introDone}
            />
          </div>
        </div>

        {/* INFORMATION SECTION: DOWN on Tab, RIGHT on Desktop */}
        <div className="flex w-full lg:border-t-0 lg:border-l lg:border-slate-200/90 lg:pt-0 lg:mt-0">
          <div className="w-full grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 items-center gap-6 lg:gap-4 lg:px-4 lg:h-full lg:justify-center">
            {/* 1st: Monthly EMI */}
            <div className="flex flex-col justify-center border-b-0 md:border-r md:border-slate-200/80 md:pr-4 lg:border-r-0 lg:border-b lg:border-slate-200/80 lg:pb-5 lg:pt-1">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-[0.11em] sm:text-xs">
                  Estimated Monthly EMI
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-1.5 whitespace-nowrap text-slate-900">
                <span className="text-xl font-semibold sm:text-2xl">₹</span>
                <span className="text-3xl font-black leading-none tracking-tight tabular-nums sm:text-4xl lg:text-[2.2rem] xl:text-[2.5rem]">
                  <MemoRollingNumber value={emi} />
                </span>
                <span className="text-xs font-medium text-slate-500 sm:text-sm">
                  / month
                </span>
              </div>
            </div>

            {/* 2nd: Loan Amount and Total Interest (2 rows) */}
            <div className="flex min-w-0 flex-col justify-between gap-2.5 md:border-r md:border-slate-200/80 lg:border-r-0 lg:py-2">
              {/* Row 1: Loan Amount */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                  Loan Amount
                </span>
                <span className="flex items-baseline gap-1 text-base font-bold text-slate-900 sm:text-lg tabular-nums">
                  <span className="text-xs font-semibold text-slate-600 sm:text-sm">
                    ₹
                  </span>
                  <MemoRollingNumber value={loanPrincipal} />
                </span>
              </div>

              <div className="h-px w-full bg-slate-100" />

              {/* Row 2: Total Interest */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                    Total Interest
                  </span>
                  <span className="flex items-baseline gap-1 text-base font-bold text-slate-900 sm:text-lg tabular-nums">
                    <span className="text-xs font-semibold text-slate-600 sm:text-sm">
                      ₹
                    </span>
                    <MemoRollingNumber value={totalInterest} />
                  </span>
                </div>
                <p className="mt-0.5 text-right text-xs text-slate-400">
                  Calculated after down payment*
                </p>
              </div>
            </div>

            {/* 3rd: Get Offers Button */}
            <div className="flex w-full items-center justify-center pt-2 lg:pt-0">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                onClick={handleOpenEmiOffers}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Get EMI Offers
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
