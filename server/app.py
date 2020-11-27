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
        query ProductReport($id:ID!) {
            product(id: $id) {
                id
                name
                number
                count
                expirationDate
                dateCreated
                dateModified
                notes
                completed
                materials {
                edges {
                    countUsed
                    node {
                    id
                    name
                    number
                    count
                    expirationDate
                    dateCreated
                    dateCreated
                    price
                    units
                    notes
                    }
                }
                }
            }
        }
        """, variables={'id': id})

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
                number
                dateCreated
                dateModified
                notes
                cases {
                edges {
                    node {
                    id
                    name
                    productName
                    productCount
                    count
                    expirationDate
                    dateCreated
                    dateModified
                    shipped
                    notes
                    materials {
                        edges {
                        node {
                            id
                            name
                            number
                            count
                            expirationDate
                            dateCreated
                            dateModified
                            price
                            units
                            notes
                        }
                        countUsed
                        }
                    }
                    products {
                        edges {
                        node {
                            id
                            name
                            number
                            count
                            expirationDate
                            dateCreated
                            dateModified
                            notes
                            completed
                            materials {
                            edges {
                                node {
                                id
                                name
                                number
                                count
                                expirationDate
                                dateCreated
                                dateModified
                                price
                                units
                                notes
                                }
                                countUsed
                            }
                            }
                        }
                        countUsed
                        }
                    }
                    }
                    countUsed
                }
                }
            }
        }
        """, variables={'id': id})

        return res.data

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )
