Requirements.

- Tags
- Logical Expressions (and, or, equals, less than, greater than, etc)?
- 

## R&D UI/UX Examples

### Beehiiv 
![[Screenshot from 2023-08-15 17-54-38.png]]

https://app.beehiiv.com/api/v2/segments/9d2724c7-acc9-4c42-bfe8-95d8fa24762a?publication_id=045caa26-fa83-41d6-8704-ff732bf11f21

the structure:

```json
{
  "id": "9d2724c7-acc9-4c42-bfe8-95d8fa24762a",
  "conditions": {
    "conditions": [
      {
        "name": "email",
        "type": "attribute",
        "filters": {
          "value": "typedream",
          "operator": "contain"
        }
      },
      {
        "type": "group",
        "conditions": [
          {
            "name": "channel",
            "type": "attribute",
            "filters": {
              "value": "website",
              "operator": "equal"
            }
          }
        ],
        "logical_operator": "or"
      }
    ],
    "logical_operator": "and"
  },
  "created_at": "2023-08-15T22:18:27.107Z",
  "created_by_user_id": "e6e36a7f-b864-4fdb-a90a-de0f6cd7d255",
  "deleted_at": null,
  "deleted_by_user_id": null,
  "failed_reason": null,
  "last_processed_at": "2023-08-16T00:47:07.331Z",
  "name": "Static Test",
  "num_members": 1,
  "paused": false,
  "publication_id": "045caa26-fa83-41d6-8704-ff732bf11f21",
  "recalculatable": true,
  "segment_type": "static",
  "status": "completed",
  "updated_at": "2023-08-16T00:47:07.103Z",
  "updated_by_user_id": "e6e36a7f-b864-4fdb-a90a-de0f6cd7d255",
  "user_touched_at": "2023-08-16T00:47:06.969Z"
}
```


### Convertkit

![[Screenshot from 2023-08-15 17-56-09.png]]


```json
{
    "id": 340543,
    "name": "New Segment",
    "account_id": 1438143,
    "created_at": "2023-07-10T22:36:04.000Z",
    "updated_at": "2023-08-16T00:58:13.000Z",
    "subscriber_filter": {
        "filters": [
            {
                "filters": [
                    {
                        "name": "New York New York, United States of America",
                        "latitude": 40.74997906,
                        "longitude": -73.98001693,
                        "radius": 10,
                        "type": "location"
                    },
                    {
                        "subscribable_type": "tag",
                        "subscribable_ids": [
                            3975409
                        ],
                        "type": "subscription"
                    }
                ],
                "type": "collections/any"
            }
        ],
        "type": "collections/all"
    },
    "email_address_id": 2868987,
    "version": 0,
    "audience": null
}
```

