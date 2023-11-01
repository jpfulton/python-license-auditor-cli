export interface PipInspectOutput {
  version: string;
  pip_version: string;
  environment: PipEnvironmentInfo;
  installed: PackageInfo[];
}

export interface PipEnvironmentInfo {
  implementation_name: string;
  implementation_version: string;
  os_name: string;
  platform_machine: string;
  platform_release: string;
  platform_system: string;
  platform_version: string;
  python_full_version: string;
  platform_python_implementation: string;
  python_version: string;
  sys_platform: string;
}

export interface PackageInfo {
  metadata: Metadata;
  metadata_location: string;
  installer: string;
  requested: boolean;
}

export interface Metadata {
  metadata_version: string;
  name: string;
  version: string;
  summary: string;
  home_page: string;
  platform: string[];
  author: string;
  author_email: string;
  license: string;
  classifier: string[];
  requires_dist: string[];
  requires_python: string;
  description_content_type: string;
  description: string;
}
