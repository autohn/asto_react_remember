migrate((db) => {
  const collection = new Collection({
    "id": "7tj4fqg9as8thm6",
    "created": "2023-01-08 17:01:35.352Z",
    "updated": "2023-01-08 17:01:35.352Z",
    "name": "words",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "caofrjrk",
        "name": "eng",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ykkrinvi",
        "name": "rus",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7tj4fqg9as8thm6");

  return dao.deleteCollection(collection);
})
