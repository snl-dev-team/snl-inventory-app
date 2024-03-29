from chalice import Chalice, Response, CognitoUserPoolAuthorizer
import json
from chalicelib.schema import schema
from chalicelib.report import PRODUCT_REPORT, ORDER_REPORT, write_dictionary, write_data
import xlsxwriter
from io import BytesIO

app = Chalice(app_name='snl-inventory-app')

app.api.cors = True


authorizer = CognitoUserPoolAuthorizer(
    'snl-inventory-app',
    provider_arns=[
        'arn:aws:cognito-idp:us-east-1:595723023717:userpool/us-east-1_fiXPTAJzP'
    ]
)


@app.route('/graphql', methods=['POST'],  authorizer=authorizer)
def graphql():
    gql = json.loads(app.current_request.raw_body.decode())
    variables = gql['variables'] if 'variables' in gql else None
    result = schema.execute(gql['query'], variables=variables)
    return {'data': result.data}


@app.route('/product/{id}/report', methods=['GET'], authorizer=authorizer)
def product_report(id):
    try:
        res = schema.execute(PRODUCT_REPORT, variables=dict(id=id))
        sheet = write_data(res.data)
        headers = {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }

        return Response(
            body=sheet,
            status_code=200,
            headers=headers,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )


@app.route('/order/{id}/report', methods=['GET'], authorizer=authorizer)
def order_report(id):
    try:
        res = schema.execute(ORDER_REPORT, variables=dict(id=id))
        sheet = write_data(res.data)
        headers = {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }

        return Response(
            body=sheet,
            status_code=200,
            headers=headers,
        )

    except Exception as e:
        return Response(
            body=json.dumps({'message': str(e)}),
            status_code=400,
        )
