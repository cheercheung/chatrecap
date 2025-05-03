import { Header } from "@/types/blocks/header";
import { Hero } from "@/types/blocks/hero";
import { Section } from "@/types/blocks/section";
import { Footer } from "@/types/blocks/footer";
import { UploadBox } from "@/types/blocks/upload-box";
import { Pricing } from "@/types/blocks/pricing";
import { SimplePricing } from "@/types/blocks/simple-pricing";

export interface LandingPage {
  header?: Header;
  hero?: Hero;
  upload_box?: UploadBox;
  branding?: Section;
  scenarios?: Section;
  platform_upload?: Section;
  introduce?: Section;
  benefit?: Section;
  usage?: Section;
  feature?: Section;
  showcase?: Section;
  stats?: Section;
  pricing?: Pricing;
  simple_pricing?: SimplePricing;
  testimonial?: Section;
  faq?: Section;
  cta?: Section;
  footer?: Footer;
}
