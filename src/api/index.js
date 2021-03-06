const express = require('express');
const BigCommerce = require('node-bigcommerce');
const fetch = require('node-fetch');


const bigCommerce = new BigCommerce({
    clientId: '4i54xjq6tyr3hbmsmv2zojgi2o0mzu7',
    accessToken: '14kj4rsp0ot89q07dvuacqob3vs0c6l',
    storeHash: '85kzbf18qd',
    responseType: 'json',
    apiVersion: 'v3' // Default is v2
})

const app = express();

//ROUTE DEFINE
app.get('/product/:id', async function (req, res) {
    try {
        // bigCommerce.post('/storefront/api-token', {
        //     "channel_id": 1,
        //     "expires_at": 1680766652,
        //     "allowed_cors_origins": 
        //       ["https://vkolchin.mybigcommerce.com"]
        // }).then((data)=>{
        //     console.log('data', data.data.token);
        // })
        console.log('request.params.id', req.params.id)
        var query = `query productById(
          $productId: Int!
          # Use GraphQL Query Variables to inject your product ID
        ) {
          site {
            product(entityId: $productId) {
              id
              entityId
              name
              description
              sku
              defaultImage {
                ...ImageFields
              }
              images {
                edges {
                  node {
                    ...ImageFields
                  }
                }
              }
              reviewSummary {
                summationOfRatings
                numberOfReviews
              }
              variants{
                edges {
                  node {
                    entityId
                    id
                    sku
                    productOptions {
                      edges {
                        node {
                          entityId
                          displayName
                        }
                      }
                    }
                    options {
                      edges {
                        node {
                          entityId
                          displayName
                        }
                      }
                    }
                  }
                }
              }
              productOptions {
                edges {
                  node {
                    entityId
                    displayName
                  }
                }
              }
              options {
                edges {
                  node {
                    displayName
                    values {
                      edges {
                        node {
                          label
                          entityId
                        }
                      }
                    }
                  }
                }
              }
              prices {
                price {
                  ...MoneyFields
                }
                priceRange {
                  min {
                    ...MoneyFields
                  }
                  max {
                    ...MoneyFields
                  }
                }
                salePrice {
                  ...MoneyFields
                }
                retailPrice {
                  ...MoneyFields
                }
                saved {
                  ...MoneyFields
                }
                bulkPricing {
                  minimumQuantity
                  maximumQuantity
                  ... on BulkPricingFixedPriceDiscount {
                    price
                  }
                  ... on BulkPricingPercentageDiscount {
                    percentOff
                  }
                  ... on BulkPricingRelativePriceDiscount {
                    priceAdjustment
                  }
                }
              }
              brand {
                name
              }
            }
          }
        }
        
        fragment ImageFields on Image {
          url320wide: url(width: 320)
          url640wide: url(width: 640)
          url960wide: url(width: 960)
          url1280wide: url(width: 1280)
        }
        
        fragment MoneyFields on Money {
          value
          currencyCode
        }`;

        fetch('https://vkolchin.mybigcommerce.com/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cHM6Ly92a29sY2hpbi5teWJpZ2NvbW1lcmNlLmNvbSJdLCJlYXQiOjE2ODA3NjY2NTIsImlhdCI6MTY1NzQ4NjQwMywiaXNzIjoiQkMiLCJzaWQiOjEwMDIxNzA4ODMsInN1YiI6IjRpNTR4anE2dHlyM2hibXNtdjJ6b2pnaTJvMG16dTciLCJzdWJfdHlwZSI6MiwidG9rZW5fdHlwZSI6MX0.N83X5TciXO1RT-uQMukl81Wzx1BFoRILa6lo7OlojM0VfEDPs6aIm_T6dAg5YMMZr3xUq3z82UXTEGBqOJDSFg'
            },
            // body: JSON.stringify({ query: getProductsSKU})
            body: JSON.stringify({ 
              query,
              variables: { productId: parseInt(req.params.id) },
          })
          })
          .then(response => response.json())
          .then(data => {
            res.send({'productPDP': data.data.site})
          })
          .catch(error => console.error(error));
    } catch (e) {
        console.log('error', e)
    }
});


app.listen(8080 || process.env.PORT, function () {
    console.log('Server is running:');
}); 