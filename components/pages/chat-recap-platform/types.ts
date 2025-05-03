export interface Platform {
  name: string;
  title: string;
  description: string;
  downloadGuide: string;
  guideLink: string;
  actionText: string;
  icon?: React.ReactNode;
}

export interface ChatRecapPlatformPageProps {
  pageTitle: string;
  pageDescription: string;
  platforms: Platform[];
  guideText: string;
  className?: string;
}
