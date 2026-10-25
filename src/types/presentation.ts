export interface TeamMember {
  name: string;
  role: string;
}

export interface SpecItem {
  label: string;
  value: string;
  detail?: string;
  badge?: string;
}

export interface ControllerInfo {
  title: string;
  model: string;
  description: string;
  executionSpeed?: string;
  signals?: string;
  highlights: string[];
}

export interface ActuatorInfo {
  title: string;
  model: string;
  type: string;
  specs: SpecItem[];
  description: string;
}

export interface SensorInfo {
  title: string;
  type: string;
  range: string;
  responseTime: string;
  description: string;
}

export interface StationData {
  id: string;
  number: number;
  orderTitle: string;
  name: string;
  shortName: string;
  subtitle: string;
  summary: string;
  videoSrc: string;
  posterSrc: string;
  pdfFile: string;
  pdfName: string;
  photos: string[];
  controllers: ControllerInfo[];
  actuators: ActuatorInfo[];
  sensors: SensorInfo[];
  keySpecs: {
    precision: string;
    speed: string;
    pressureForce: string;
    cycleTime: string;
    precisionBadge: string;
    speedBadge: string;
    forceBadge: string;
    cycleBadge: string;
  };
  threeModelType: 'handling' | 'sorting' | 'robot' | 'torno';
}

export interface QuizQuestion {
  id: number;
  station: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
