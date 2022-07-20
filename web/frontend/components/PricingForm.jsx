import { useState, useCallback } from "react";
import {
  Banner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  ChoiceList,
  Select,
  Thumbnail,
  Icon,
  Stack,
  TextContainer,
  TextStyle,
  Layout,
  EmptyState,
} from "@shopify/polaris";
import {
  ContextualSaveBar,
  ResourcePicker,
  useAppBridge,
  useNavigate,
} from "@shopify/app-bridge-react";
import { ImageMajor, AlertMinor, RefreshMajor } from "@shopify/polaris-icons";

/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch, useAppQuery } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";

export function PricingForm({ QRCode: InitialQRCode, metalsPricing }) {
  const [QRCode, setQRCode] = useState(InitialQRCode);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(QRCode?.product);
  const [metalPrice, setMetalPrice] = useState(QRCode?.metalPrice || metalsPricing[0].gold);
  const [productPrice, setProductPrice] = useState(QRCode?.productPrice || "");
  

  //navigate and appBridge are from @shopify/app-bridge-react
  const navigate = useNavigate();
  const appBridge = useAppBridge();

  const fetch = useAuthenticatedFetch();
  const deletedProduct = QRCode?.product?.title === "Deleted product";

  //console.log(QRCode);
  //console.log(selectedProduct);
  //console.log(metalsPricing);
  //console.log(metalsPricing[0].gold);
  

  /*
    This is a placeholder function that is triggered when the user hits the "Save" button.

    It will be replaced by a different function when the frontend is connected to the backend.
  */
  const onSubmit = (body) => console.log("submit", body);

  /*
    Sets up the form state with the useForm hook.

    Accepts a "fields" object that sets up each individual field with a default value and validation rules.

    Returns a "fields" object that is destructured to access each of the fields individually, so they can be used in other parts of the component.

    Returns helpers to manage form state, as well as component state that is based on form state.
  */
  const {
    fields: {
      productId,
      variantId,
      handle,
      weight,
      price,
      metal,
    },
    dirty,
    reset,
    submitting,
    submit,
    makeClean,
  } = useForm({
    fields: {
      productId: useField({
        value: deletedProduct ? "Deleted product" : QRCode?.product?.id || "",
        validates: [notEmptyString("Please select a product")],
      }),
      variantId: useField(QRCode?.variantId || ""),
      handle: useField(QRCode?.handle || ""),
      price: useField(QRCode?.price || ""),
      weight: useField(QRCode?.weight || ""),
      metal: useField(QRCode?.metal || "gold"),
    },
    onSubmit,
  });

  /*
    This function is called with the selected product whenever the user clicks "Add" in the ResourcePicker.

    It takes the first item in the selection array and sets the selected product to an object with the properties from the "selection" argument.

    It updates the form state using the "onChange" methods attached to the form fields.

    Finally, closes the ResourcePicker.
  */
  const handleProductChange = useCallback(({ selection }) => {
    setSelectedProduct({
      title: selection[0].title,
      images: selection[0].images,
      handle: selection[0].handle,
      price: selection[0].variants[0].price,
      hasVariants: !selection[0].hasOnlyDefaultVariant,
      variantTitle: selection[0].variants[0].title
    });
    productId.onChange(selection[0].id);
    variantId.onChange(selection[0].variants[0].id);
    price.onChange(selection[0].variants[0].price);
    handle.onChange(selection[0].handle);
    setShowResourcePicker(false);
  }, []);

  /*
    This function updates the form state whenever a user selects a new metal option.
  */
  const handleMetalChange = useCallback((selection) => {
    metal.onChange(selection[0]);
    
    setMetalPrice(()=>{
      if (selection[0] == "gold") {
        console.log("gold price")
        return metalsPricing[0].gold;
      }
      else if (selection[0] == "silver") {
        console.log("silver price")
        return metalsPricing[1].silver;
      }
    })
  }, []);

  const updateMetalPricing = useCallback((input) => {
    console.log("update metal pricing");
    console.log(input);
    weight.onChange(input);

    setProductPrice((input * metalPrice).toFixed(3))
  }, []);


  /*
    This function is called when a user clicks "Select product" or cancels the ProductPicker.

    It switches between a show and hide state.
  */
  const toggleResourcePicker = useCallback(
    () => setShowResourcePicker(!showResourcePicker),
    [showResourcePicker]
  );

  /*
    This is a placeholder function that is triggered when the user hits the "Delete" button.

    It will be replaced by a different function when the frontend is connected to the backend.
  */
  const isDeleting = false;
  const deleteQRCode = () => console.log("delete");





  /*
    These variables are used to display product images, and will be populated when image URLs can be retrieved from the Admin.
  */
  const imageSrc = selectedProduct?.images?.edges?.[0]?.node?.url;
  const originalImageSrc = selectedProduct?.images?.[0]?.originalSrc;
  const altText =
    selectedProduct?.images?.[0]?.altText || selectedProduct?.title;

  /* The form layout, created using Polaris and App Bridge components. */
  return (
    <Stack vertical>
      {deletedProduct && (
        <Banner
          title="The product for this QR code no longer exists."
          status="critical"
        >
          <p>
            Scans will be directed to a 404 page, or you can choose another
            product for this QR code.
          </p>
        </Banner>
      )}
      <Layout>
        <Layout.Section>
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <Card
                title="Product"
                actions={[
                  {
                    content: productId.value
                      ? "Change product"
                      : "Select product",
                    onAction: toggleResourcePicker,
                  },
                ]}
              >
                <Card.Section>

                  {/* //resource picker overlay: */}
                  {showResourcePicker && (
                    <ResourcePicker
                      resourceType="Product"
                      showVariants={true}
                      selectMultiple={false}
                      onCancel={toggleResourcePicker}
                      onSelection={handleProductChange}
                      open
                    />
                  )}

                  {/* //if a product is picked, this will show: */}
                  {productId.value ? (
                    <Stack alignment="center">
                      {imageSrc || originalImageSrc ? (
                        <Thumbnail
                          source={imageSrc || originalImageSrc}
                          alt={altText}
                        />
                      ) : (
                        <Thumbnail
                          source={ImageMajor}
                          color="base"
                          size="small"
                        />
                      )}
                      <TextContainer>
                      <TextStyle variation="strong">
                        {selectedProduct.title}
                      </TextStyle>
                      {selectedProduct.hasVariants && (
                      <TextStyle>
                        <p>{selectedProduct.variantTitle}</p>
                      </TextStyle>
                      )}
                      <TextStyle>
                        <p>{selectedProduct.price}</p>
                      </TextStyle>
                      </TextContainer>
                    </Stack>
                  ) : (
                    <Stack vertical spacing="extraTight">
                      <Button onClick={toggleResourcePicker}>
                        Select product
                      </Button>
                      {productId.error && (
                        <Stack spacing="tight">
                          <Icon source={AlertMinor} color="critical" />
                          <TextStyle variation="negative">
                            {productId.error}
                          </TextStyle>
                        </Stack>
                      )}
                    </Stack>
                  )}
                  {/* //if a product is picked, this will show, otherwise show "select product"^ */}
                </Card.Section>


                <Card.Section title="Choose the Precious Metal">
                  <Stack alignment="center" distribution="fillEvenly">
                  <ChoiceList
                    title="Linked to the price of:"
                    titleHidden
                    choices={[
                      { label: "Gold", value: "gold" },
                      {
                        label: "Silver",
                        value: "silver",
                      },
                    ]}
                    selected={metal.value}
                    onChange={handleMetalChange}
                  />
                  <TextContainer>
                  <TextStyle><p>Current price: ${metalPrice}USD/kg</p></TextStyle>
                  <TextStyle><p>Last updated: date</p></TextStyle>
                  </TextContainer>
                  <Button>
                  <Icon
                    source={RefreshMajor}
                    color="base"
                  />
                  </Button>
                  </Stack>
                </Card.Section>

                <Card.Section title="Product Pricing Options">
                  <Stack alignment="center" distribution="fillEvenly">
                    <TextField
                      {...weight}
                      label="Weight"
                      labelHidden
                      helpText="Weight"
                      onChange={updateMetalPricing}
                    />
                    
                    <TextStyle><p>Current price: ${metalPrice}USD/kg</p></TextStyle>

                    <TextStyle>
                      <p>Total price: {productPrice}</p>
                    </TextStyle>

                  </Stack>
                </Card.Section>
              </Card>
            </FormLayout>
          </Form>
        </Layout.Section>

        <Layout.Section>
          {QRCode?.id && (
            <Button
              outline
              destructive
              onClick={deleteQRCode}
              loading={isDeleting}
            >
              Delete QR code
            </Button>
          )}
        </Layout.Section>
      </Layout>
    </Stack>
  );
}

/* Builds a URL to the selected product */
// function productViewURL({ host, productHandle, discountCode }) {
//   const url = new URL(host);
//   const productPath = `/products/${productHandle}`;

//   /*
//     If a discount is selected, then build a URL to the selected discount that redirects to the selected product: /discount/{code}?redirect=/products/{product}
//   */
//   if (discountCode) {
//     url.pathname = `/discount/${discountCode}`;
//     url.searchParams.append("redirect", productPath);
//   } else {
//     url.pathname = productPath;
//   }

//   return url.toString();
// }

/* Builds a URL to a checkout that contains the selected product */
// function productCheckoutURL({ host, variantId, quantity = 1, discountCode }) {
//   const url = new URL(host);
//   const id = variantId.replace(
//     /gid:\/\/shopify\/ProductVariant\/([0-9]+)/,
//     "$1"
//   );

//   url.pathname = `/cart/${id}:${quantity}`;

//   /* Builds a URL to a checkout that contains the selected product with a discount code applied */
//   if (discountCode) {
//     url.searchParams.append("discount", discountCode);
//   }

//   return url.toString();
// }
