import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { PricingForm } from "../../components";

export default function ManageCode() {
  const breadcrumbs = [{ content: "Precious Metals Pricing Linker", url: "/" }];

  return (
    <Page>
      <TitleBar
        title="Create new pricing object"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <PricingForm />
    </Page>
  );
}
