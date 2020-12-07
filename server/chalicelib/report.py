import xlsxwriter

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
                }
                }
            }
        }
        """
