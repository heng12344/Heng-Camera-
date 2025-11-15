import type { EditControls } from './types';

export const OBJECT_ROTATIONS = [
  'គ្មាន (None)',
  'ចំពីខាងមុខ (Front View)',
  'ចំពីខាងក្រោយ (Back View)',
  'ចំពីចំហៀងឆ្វេង (Left Side View)',
  'ចំពីចំហៀងស្ដាំ (Right Side View)',
  'ចំពីខាងមុខ ៤៥° (Front 45° View)',
  'ចំពីខាងក្រោយ ៤៥° (Back 45° View)',
  'ចំពីចំហៀងឆ្វេង ៤៥° (Left Side 45° View)',
  'ចំពីចំហៀងស្ដាំ ៤៥° (Right Side 45° View)'
] as const;

export const CAMERA_VERTICAL_ANGLES = [
  'មុំកាមេរ៉ា 0° (Level 0°)',
  'មុំកាមេរ៉ា ឡើងលើ 25° (Up 25°)',
  'មុំកាមេរ៉ា ឡើងលើ 45° (Up 45°)',
  'មុំកាមេរ៉ា ឡើងលើ 75° (Up 75°)',
  'មុំកាមេរ៉ា ឡើងលើ 90° (Up 90°)',
  'មុំកាមេរ៉ា ចុះក្រោម 25° (Down 25°)',
  'មុំកាមេរ៉ា ចុះក្រោម 45° (Down 45°)',
  'មុំកាមេរ៉ា ចុះក្រោម 75° (Down 75°)',
  'មុំកាមេរ៉ា ចុះក្រោម 90° (Down 90°)',
] as const;

export const HAND_GESTURES = [
  'គ្មាន (None)', 'គ្រវីដៃ (Waving)', 'ចង្អុល (Pointing)', 'ក្ដាប់ដៃ (Fist)', 'មេដៃឡើង (Thumbs Up)', 'សញ្ញាសន្តិភាព (Peace Sign)', 'បាតដៃបើក (Open Palm)', 'កាន់វត្ថុ (Holding Object)', 'វាយអក្សរ (Typing)', 'ទះដៃ (Clapping)', 'សម្រាក (Relaxed)'
] as const;

export const FEET_GESTURES = [
  'គ្មាន (None)', 'ឈរ (Standing)', 'ដើរ (Walking)', 'រត់ (Running)', 'លោត (Jumping)', 'ឈានចុងជើង (Tiptoe)', 'ទាត់ (Kicking)', 'គងជើង (Crossed Legs)', 'សម្រាក (Relaxed)', 'ចង្អុលចុងជើង (Pointing Toe)', 'ឈរជើងម្ខាង (One Leg Stand)'
] as const;

export const BODY_POSES = [
  'គ្មាន (None)', 'ឈរត្រង់ (Standing Straight)', 'អង្គុយ (Sitting)', 'ឱនទៅមុខ (Leaning Forward)', 'ផ្អៀងទៅក្រោយ (Leaning Back)', 'ដេក (Lying Down)', 'អង្គុយច្រហោង (Squatting)', 'ក្រពាត់ដៃ (Arms Crossed)', 'ច្រត់ចង្កេះ (Hands on Hips)', 'ពត់ខ្លួន (Stretching)', 'រាំ (Dancing)'
] as const;

export const INITIAL_CONTROLS: EditControls = {
  objectRotation: 'គ្មាន (None)',
  cameraUpDown: 'មុំកាមេរ៉ា 0° (Level 0°)',
  cameraRotation: 0,
  zoom: 0,
  handGesture: 'គ្មាន (None)',
  feetGesture: 'គ្មាន (None)',
  bodyPose: 'គ្មាន (None)',
  prompt: '',
  lockAspectRatio: true,
};
