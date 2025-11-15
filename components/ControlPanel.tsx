import React, { useState } from 'react';
import { SliderControl } from './SliderControl';
import { SelectControl } from './SelectControl';
import { RotateIcon, CameraIcon, ZoomIcon, SettingsIcon } from './icons/Icons';
import { HAND_GESTURES, FEET_GESTURES, BODY_POSES, OBJECT_ROTATIONS, CAMERA_VERTICAL_ANGLES } from '../constants';
import type { EditControls } from '../types';
import { buildPrompt } from '../services/geminiService';

interface ToggleControlProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleControl: React.FC<ToggleControlProps> = ({ label, checked, onChange }) => {
  const toggleId = `toggle-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center justify-between">
      <label htmlFor={toggleId} className="text-sm font-medium text-gray-300 cursor-pointer">
        {label}
      </label>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
          checked ? 'bg-indigo-600' : 'bg-gray-700'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

const PromptModal: React.FC<{ isOpen: boolean; onClose: () => void; prompt: string }> = ({ isOpen, onClose, prompt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="prompt-modal-title">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        <h2 id="prompt-modal-title" className="text-xl font-semibold p-4 border-b border-gray-700 text-purple-300">
          ប្រអប់បញ្ជាដែលបានបង្កើត (Generated Prompt)
        </h2>
        <div className="flex-grow p-4 overflow-y-auto">
          <pre className="text-gray-300 whitespace-pre-wrap break-words bg-gray-900/50 p-4 rounded-md font-mono text-sm">{prompt}</pre>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            បិទ (Close)
          </button>
        </div>
      </div>
    </div>
  );
};


interface ControlPanelProps {
  controls: EditControls;
  setControls: React.Dispatch<React.SetStateAction<EditControls>>;
  onGenerate: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ controls, setControls, onGenerate, isLoading, isImageUploaded }) => {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleControlChange = <K extends keyof EditControls,>(key: K, value: EditControls[K]) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const handleShowPrompt = () => {
    const prompt = buildPrompt(controls);
    setCurrentPrompt(prompt);
    setIsPromptModalOpen(true);
  };

  const sliderControlGroups = [
    {
        title: 'ការបញ្ជាពង្រីក (Zoom Controls)',
        icon: <ZoomIcon />,
        controls: [
            { id: 'zoom', label: 'ពង្រីក (Zoom)', min: -20, max: 20, step: 0.5, unit: 'x' },
        ]
    }
  ];

  return (
    <>
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        prompt={currentPrompt}
      />
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 flex flex-col h-full shadow-2xl">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-700">ផ្ទាំងបញ្ជា (Control Panel)</h2>
        <div className="flex-grow p-4 overflow-y-auto space-y-6">
          <div className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-medium flex items-center gap-2 text-purple-300">
                <SettingsIcon />
                ការកំណត់​រូបភាព (Image Settings)
              </h3>
              <ToggleControl
                label="ចាក់សោសមាមាត្រ (Lock Aspect Ratio)"
                checked={controls.lockAspectRatio}
                onChange={value => handleControlChange('lockAspectRatio', value)}
              />
          </div>

          <div className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium flex items-center gap-2 text-purple-300">
              <RotateIcon />
              ការបញ្ជាវត្ថុ (Object Controls)
            </h3>
            <SelectControl
              label="ទិសដៅវត្ថុ (Object Orientation)"
              options={OBJECT_ROTATIONS}
              value={controls.objectRotation}
              onChange={v => handleControlChange('objectRotation', v)}
            />
          </div>

          <div className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium flex items-center gap-2 text-purple-300">
              <CameraIcon />
              ការបញ្ជាកាមេរ៉ា (Camera Controls)
            </h3>
            <SelectControl
              label="មុំបញ្ឈរ (Vertical Angle)"
              options={CAMERA_VERTICAL_ANGLES}
              value={controls.cameraUpDown}
              onChange={v => handleControlChange('cameraUpDown', v)}
            />
            <SliderControl
              label="ការបង្វិលផ្ដេក (Horizontal Rotation)"
              value={controls.cameraRotation}
              onChange={value => handleControlChange('cameraRotation', value)}
              min={0}
              max={360}
              step={1}
              unit="°"
            />
          </div>

          {sliderControlGroups.map(group => (
            <div key={group.title} className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
              <h3 className="text-lg font-medium flex items-center gap-2 text-purple-300">
                {group.icon}
                {group.title}
              </h3>
              {group.controls.map(control => (
                <SliderControl
                  key={control.id}
                  label={control.label}
                  value={controls[control.id as keyof EditControls] as number}
                  onChange={value => handleControlChange(control.id as keyof EditControls, value)}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  unit={control.unit}
                />
              ))}
            </div>
          ))}
          
          <div className="space-y-4 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium text-purple-300">ការបញ្ជាកាយវិការ (Gesture Controls)</h3>
            <SelectControl label="កាយវិការដៃ (Hand Gesture)" options={HAND_GESTURES} value={controls.handGesture} onChange={v => handleControlChange('handGesture', v)} />
            <SelectControl label="កាយវិការជើង (Feet Gesture)" options={FEET_GESTURES} value={controls.feetGesture} onChange={v => handleControlChange('feetGesture', v)} />
            <SelectControl label="ឥរិយាបថរាងកាយ (Body Pose)" options={BODY_POSES} value={controls.bodyPose} onChange={v => handleControlChange('bodyPose', v)} />
          </div>

          <div className="space-y-2 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
            <label htmlFor="prompt" className="block text-lg font-medium text-purple-300">ប្រអប់បញ្ជាផ្ទាល់ខ្លួន (Custom Prompt)</label>
            <textarea
              id="prompt"
              value={controls.prompt}
              onChange={e => handleControlChange('prompt', e.target.value)}
              placeholder="ឧ. 'ប្តូរអាវទៅជាពណ៌ក្រហម', 'បន្ថែមមួក' (e.g., 'change shirt to red', 'add a hat')"
              className="w-full h-24 p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-700 mt-auto space-y-3">
          <button
            onClick={handleShowPrompt}
            disabled={!isImageUploaded}
            className="w-full bg-gray-700 text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
          >
            បង្ហាញប្រអប់បញ្ជា (Show Prompt)
          </button>
          <button
            onClick={onGenerate}
            disabled={isLoading || !isImageUploaded}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {isLoading ? 'កំពុងបង្កើត... (Generating...)' : 'អនុវត្តការកែសម្រួល (Apply Edits)'}
          </button>
          {!isImageUploaded && <p className="text-center text-xs text-yellow-400 mt-2">សូមផ្ទុករូបភាពដើម្បីអាចបង្កើតបាន។ (Please upload an image to enable.)</p>}
        </div>
      </div>
    </>
  );
};
