import xlsxwriter
from io import BytesIO

PRODUCT_REPORT = """
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
        """

ORDER_REPORT = """
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
                    orderCount
                }
                }
            }
        }
        """


def write_dictionary(dictionary, worksheet):
    col_num = 0
    for key, value in dictionary.items():
        worksheet.write(0, col_num, key)
        worksheet.write_column(1, col_num, value)
        col_num += 1


def node_to_dictionary(nodes):
    results = {}
    for node in nodes:
        for key, value in node.items():
            if not isinstance(value, dict):
                results[key] = []

    print(results)
    for node in nodes:
        for key in results:
            if key in node:
                results[key].append(node[key])
            else:
                results[key].append(None)

    return results


def write_data(data):
    output = BytesIO()
    workbook = xlsxwriter.Workbook(output)
    sheets = {'materials': workbook.add_worksheet('materials'),
              'products': workbook.add_worksheet('products'),
              'cases': workbook.add_worksheet('cases'),
              'orders': workbook.add_worksheet('orders')}

    export_type = next(
        t for t in ['order', 'case', 'product', 'material']
        if t in data)

    top_level_values = {
        k: [v] for k, v in data[export_type].items()
        if not isinstance(v, dict)
    }

    write_dictionary(top_level_values, sheets[export_type + 's'])

    def write_relations(node, user_type, user_id):
        edge_nodes = {k: v for k, v in node.items() if isinstance(v, dict)}
        for edge_name, values in edge_nodes.items():
            edges = values['edges']
            nodes = []
            for edge in edges:
                node = edge['node']
                count = edge['count']
                order_count = edge['orderCount'] if 'orderCount' in edge else None

                node['countUsed'] = count

                if order_count is not None:
                    node['orderCount'] = order_count

                node[user_type + 'Id'] = user_id

                nodes.append(node)
                write_relations(node, edge_name[:-1], node['id'])

            if not nodes:
                return

            dictionary = node_to_dictionary(nodes)
            sheet = sheets[edge_name]
            write_dictionary(dictionary, sheet)

    write_relations(data[export_type], export_type, data[export_type]['id'])

    workbook.close()
    output.seek(0)
    return output.read()
