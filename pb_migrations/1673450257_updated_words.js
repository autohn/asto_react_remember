migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tj4fqg9as8thm6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oz49pzok",
    "name": "correctAnswers",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "srat2d4g",
    "name": "wrongAnswers",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 0,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tj4fqg9as8thm6")

  // remove
  collection.schema.removeField("oz49pzok")

  // remove
  collection.schema.removeField("srat2d4g")

  return dao.saveCollection(collection)
})
