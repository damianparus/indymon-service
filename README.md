Devel:

```
./gradlew clean bootRun
```

Run:

```
./gradlew clean build
sudo java -jar ./build/libs/indymon-service-1.0.1.RELEASE.jar --spring.profiles.active=prod
```

Sample JSON:
```
{
  "checks": [
    { "symbol": "TEST_CHECK" }
  ],

  "presentersChecks": [
     {
      "symbol": "CHECK_PRESENTER",
      "checkSymbol": "TEST_CHECK",
      "title": "Check presenter title",
      "width": 10,
      "height": 10,
      "clickAction": "window.open(\"https://wp.pl\")",
      "zIndex": 1
    }
  ],

  "presentersAggregators": [
    {
      "symbol": "AGGREGATOR_PRESENTER",
      "title": "Aggregator presenter title",
      "width": 100,
      "height": 100,
      "clickAction": "menu.show({ elements:[ {command: \"alert(1);\", title: \"click\", icon: \"file\"}, {command: \"window.open(\\\"http://google.com\\\")\", title: \"click\", icon: \"file\"} ]});",
      "subPresenters": [ "CHECK_PRESENTER" ],
      "zIndex": 0
    }
  ]
}
```

and CURL:

```
curl -v "http://localhost:8080/definitions" -XPUT -d @sampleJson -H "Content-Type: application/json"
```
