import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withContentlayer } from "next-contentlayer2";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
};

export default withContentlayer(withNextIntl(nextConfig));
