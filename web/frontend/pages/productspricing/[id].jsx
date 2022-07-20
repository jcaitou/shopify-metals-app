import { Card, Page, Layout, SkeletonBodyText } from "@shopify/polaris";
import { Loading, TitleBar } from "@shopify/app-bridge-react";
import { PricingForm } from "../../components";
//import { useFetch } from '../../hooks/useFetch';

export default function PricingEdit() {
  const breadcrumbs = [{ content: "Precious Metals Pricing Linker", url: "/" }];
  //const [metalsPricing, setMetalsPricing] = useState(false);

  /*
     These are mock values.
     Set isLoading to false to preview the page without loading markup.
  */
  const isLoading = false;
  const isRefetching = false;

  const metalsPricing = [{"gold":"1715.95"},{"silver":"19.00"},{"platinum":"878.25"},{"palladium":"1943.70"},{"timestamp":1658214527460}];

  const QRCode = {
    createdAt: "2022-06-13",
    destination: "checkout",
    title: "My first QR code",
    weight:1.5,
    product: {}
  };



  /* Loading action and markup that uses App Bridge and Polaris components */
  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Edit QR code"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned title="Title">
              <SkeletonBodyText />
            </Card>
            <Card title="Product">
              <Card.Section>
                <SkeletonBodyText lines={1} />
              </Card.Section>
              <Card.Section>
                <SkeletonBodyText lines={3} />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page>
      <TitleBar
        title="Edit pricing object"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <PricingForm QRCode={QRCode} metalsPricing={metalsPricing}/>
    </Page>
  );
}
