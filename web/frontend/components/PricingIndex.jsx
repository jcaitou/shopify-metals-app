import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  Icon,
  IndexTable,
  Stack,
  TextStyle,
  Thumbnail,
  UnstyledLink,
} from "@shopify/polaris";
import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

/* useMedia is used to support multiple screen sizes */
import { useMedia } from "@shopify/react-hooks";

/* dayjs is used to capture and format the date a QR code was created or modified */
import dayjs from "dayjs";

/* Markup for small screen sizes (mobile) */
function SmallScreenCard({
  id,
  title,
  product,
  discountCode,
  scans,
  createdAt,
  navigate,
  metal,
  weight,
}) {
  return (
    <UnstyledLink onClick={() => navigate(`/productspricing/${id}`)}>
      <div
        style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #E1E3E5" }}
      >
        <Stack>
          <Stack.Item>
            <Thumbnail
              source={product?.images?.edges[0]?.node?.url || ImageMajor}
              alt="placeholder"
              color="base"
              size="small"
            />
          </Stack.Item>
          <Stack.Item fill>
            <Stack vertical={true}>
              <Stack.Item>
                <p>
                  <TextStyle variation="strong">
                    {truncate(product?.title, 35)}
                  </TextStyle>
                </p>
                <p>{dayjs(createdAt).format("MMMM D, YYYY")}</p>
              </Stack.Item>
              <div style={{ display: "flex" }}>
                <div style={{ flex: "1" }}>
                  <TextStyle variation="subdued">Linked to:</TextStyle>
                  <p>{metal || "-"}</p>
                </div>
                <div style={{ flex: "1" }}>
                  <TextStyle variation="subdued">Weight</TextStyle>
                  <p>{weight}</p>
                </div>
                <div style={{ flex: "1" }}>
                  <TextStyle variation="subdued">Product Price</TextStyle>
                <p>{product?.price}</p>
                </div>
              </div>
            </Stack>
          </Stack.Item>
        </Stack>
      </div>
    </UnstyledLink>
  );
}

export function PricingIndex({ PricingObjects, loading }) {
  const navigate = useNavigate();

  /* Check if screen is small */
  const isSmallScreen = useMedia("(max-width: 640px)");

  /* Map over QRCodes for small screen */
  const smallScreenMarkup = PricingObjects.map((QRCode) => (
    <SmallScreenCard key={QRCode.id} navigate={navigate} {...QRCode} />
  ));

  const resourceName = {
    singular: "QR code",
    plural: "QR codes",
  };

  const rowMarkup = PricingObjects.map(
    ({ id, title, product, discountCode, scans, createdAt, metal, weight }, index) => {
      const deletedProduct = product.title.includes("Deleted product");

      /* The form layout, created using Polaris components. Includes the QR code data set above. */
      return (
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
          onClick={() => {
            navigate(`/productspricing/${id}`);
          }}
        >
          <IndexTable.Cell>
            <Thumbnail
              source={product?.images?.edges[0]?.node?.url || ImageMajor}
              alt="placeholder"
              color="base"
              size="small"
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Stack>
              {deletedProduct && (
                <Icon source={DiamondAlertMajor} color="critical" />
              )}
              <TextStyle variation={deletedProduct ? "negative" : null}>
                {truncate(product?.title, 25)}
              </TextStyle>
            </Stack>
          </IndexTable.Cell>
          <IndexTable.Cell>{metal}</IndexTable.Cell>
          <IndexTable.Cell>{weight}</IndexTable.Cell>
          <IndexTable.Cell>{product?.price}</IndexTable.Cell>
          <IndexTable.Cell>
            {dayjs(createdAt).format("MMMM D, YYYY")}
          </IndexTable.Cell>
          
        </IndexTable.Row>
      );
    }
  );

  /* A layout for small screens, built using Polaris components */
  return (
    <Card>
      {isSmallScreen ? (
        smallScreenMarkup
      ) : (
        <IndexTable
          resourceName={resourceName}
          itemCount={PricingObjects.length}
          headings={[
            { title: "Thumbnail", hidden: true },
            { title: "Product" },
            { title: "Metal" },
            { title: "Weight" },
            { title: "Product Price" },
            { title: "Date created" },
          ]}
          selectable={false}
          loading={loading}
        >
          {rowMarkup}
        </IndexTable>
      )}
    </Card>
  );
}

/* A function to truncate long strings */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
