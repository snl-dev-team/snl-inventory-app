import unittest
import material
import os
import json


with open('./database_credentials.json') as f:
    db_credentials = json.load(f)


class TestMaterial(unittest.TestCase):

    def test_fetch(self):
        material.fetchMaterials(None, None)

    def setUp(self):
        os.environ['DATABASE_SECRETS_ARN'] = db_credentials['databaseSecretsArn']
        os.environ['DATABASE_NAME'] = db_credentials['databaseClusterArn']
        os.environ['DATABASE_CLUSTER_ARN'] = db_credentials['databaseName']


if __name__ == '__main__':
    unittest.main()
