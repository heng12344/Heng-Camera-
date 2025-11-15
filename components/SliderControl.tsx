
import React from 'react';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({ label, value, onChange, min, max, step, unit = '' }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm font-mono bg-gray-700 px-2 py-0.5 rounded">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
        style={{
            '--thumb-color': '#8b5cf6',
        } as React.CSSProperties}
      />
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: var(--thumb-color);
          border-radius: 50%;
          cursor: pointer;
          transition: background .2s ease-in-out;
        }
        .range-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: var(--thumb-color);
          border-radius: 50%;
          cursor: pointer;
          transition: background .2s ease-in-out;
        }
        .range-thumb:hover::-webkit-slider-thumb {
          background: #a78bfa;
        }
        .range-thumb:hover::-moz-range-thumb {
          background: #a78bfa;
        }
      `}</style>
    </div>
  );
};
