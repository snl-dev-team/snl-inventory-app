from chalice import Chalice, Response, CognitoUserPoolAuthorizer
import json
from chalicelib.schema import schema

app = Chalice(app_name='snl-inventory-app')

app.api.cors = True


authorizer = CognitoUserPoolAuthorizer(
    'snl-inventory-app',
    provider_arns=[
        'arn:aws:cognito-idp:us-east-1:595723023717:userpool/us-east-1_fiXPTAJzP'
    ]
)


@app.route('/graphql', methods=['POST'])
def graphql():
    gql = json.loads(app.current_request.raw_body.decode())
    variables = gql['variables'] if 'variables' in gql else None
    result = schema.execute(gql['query'], variables=variables)
    return {'data': result.data}


@app.route('/product/{id}/report', methods=['GET'], authorizer=authorizer)
def product_report(id):
    try:
        res = schema.execute("""
        query ProductReport($id: ID!) {
            product(id: $id) {
                id
                dateCreated
                dateModified
                count
                name
                expirationDate
                completed
                notes
                number
                defaultMaterialCount
                materials {
                edges {
                    count
                    node {
                    id
                    dateCreated
                    dateModified
                    count
                    price
                    name
                    expirationDate
                    notes
                    number
                    units
                    vendorName
                    purchaseOrderUrl
                    purchaseOrderNumber
                    certificateOfAnalysisUrl
                    }
                }
                }
            }
        }
        """, variables=dict(id=id))

        print(id)

        return res.data

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/report', methods=['GET'], authorizer=authorizer)
def order_report(id):
    try:
        res = schema.execute("""
        query OrderReport($id: ID!) {
            order(id: $id) {
                id
                dateCreated
                dateModified
                completed
                notes
                number
                defaultCaseCount
                customerName
                cases {
                edges {
                    node {
                    id
                    number
                    notes
                    dateCreated
                    dateModified
                    expirationDate
                    name
                    count
                    defaultMaterialCount
                    defaultProductCount
                    materials {
                        edges {
                        node {
                            id
                            dateCreated
                            dateModified
                            count
                            price
                            name
                            expirationDate
                            notes
                            number
                            units
                            vendorName
                            purchaseOrderUrl
                            purchaseOrderNumber
                            certificateOfAnalysisUrl
                        }
                        count
                        }
                    }
                    products {
                        edges {
                        node {
                            id
                            dateCreated
                            dateModified
                            count
                            name
                            expirationDate
                            completed
                            notes
                            number
                            defaultMaterialCount
                            materials {
                            edges {
                                node {
                                id
                                dateCreated
                                dateModified
                                count
                                price
                                name
                                expirationDate
                                notes
                                number
                                units
                                vendorName
                                purchaseOrderUrl
                                purchaseOrderNumber
                                certificateOfAnalysisUrl
                                }
                                count
                            }
                            }
                        }
                        count
                        }
                    }
                    }
                    count
                }
                }
            }
        }
        """, variables=dict(id=id))

        return Response(
            body=json.dumps(res.data),
            status_code=200,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )
