export interface ArtisanArgument {
  name: string;
  is_required: boolean;
  is_array: boolean;
  description: string;
  default: unknown;
}

export interface ArtisanOption {
  name: string;
  shortcut: string;
  accept_value: boolean;
  is_value_required: boolean;
  is_multiple: boolean;
  description: string;
  default: unknown;
}

export interface ArtisanCommand {
  name: string;
  description: string;
  category: string;
  arguments: ArtisanArgument[];
  options: ArtisanOption[];
}

export interface DetectionResult {
  root: string | undefined;
  commands: ArtisanCommand[];
  error: string | undefined;
}
