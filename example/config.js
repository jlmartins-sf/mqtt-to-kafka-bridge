"use strict";

module.exports = {

    // mqtt connection options
    mqtt: { // # see https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
        url: process.env.MQTT_HOST || "mqtt://you.url.mqtt.server.com",
        baseTopic: process.env.MQTT_TOPIC || "YourTopicFromMQTT",
        options: {
            clientId: process.env.MQTT_CLIENT_ID || "nodejs-emqx-client",
            username: process.env.MQTT_USERNAME || "user",
            password: process.env.MQTT_PASSWORD || "password",
            host: process.env.MQTT_HOST || "mqtt://you.url.mqtt.server.com",
            port: process.env.MQTT_PORT || "1883",
            protocolId: process.env.MQTT_PROTOCOL.toUpperCase() || "MQTT",
            protocolVersion: 4,
        }
    },

    // kafka connection options
    kafka: { // # see https://github.com/nodefluent/node-sinek/blob/master/lib/librdkafka/README.md
        logger: undefined,
        noptions: {
            //"debug": "all",

            "metadata.broker.list": process.env.KAFKA_HOST || "your.url.or.ip.kafka.server.com:9092",
            "client.id": process.env.KAFKA_CLIENT_ID || "mqtt-bridge-kafka-client",
            "event_cb": true,
            "compression.codec": "none",
            "retry.backoff.ms": 200,
            "message.send.max.retries": 10,
            "socket.keepalive.enable": true,
            "queue.buffering.max.messages": 100000,
            "queue.buffering.max.ms": 1000,
            "batch.num.messages": 1000000,

            //"security.protocol": "sasl_ssl",
            //"ssl.key.location": path.join(__dirname, "../certs/ca-key"),
            //"ssl.key.password": "nodesinek",
            //"ssl.certificate.location": path.join(__dirname,"../certs/ca-cert"),
            //"ssl.ca.location": path.join(__dirname,"../certs/ca-cert"),
            //"sasl.mechanisms": "PLAIN",
            //"sasl.username": "admin",
            //"sasl.password": "nodesinek",
            "api.version.request": true,
        },
        tconf: {
            "request.required.acks": 1,
        }
    },

    // declares on which target kafka topic a mqtt message should be routed to (based on the mqtt topic)
    routing: {

        //"*": "*", // from all to all (indiviudally 1:1)
        //"*": "kafka-test", // from all to single kafka-test topic
        //"mqtt-topic": "kafka-topic", // from mqtt-topic to kafka-topic only

        "*": process.env.KAFKA_TOPIC
    },

    // if routed messages should be logged to debug
    logMessages: true,

    // declares how an mqtt topic name should be split (/) to fit to the kafka topic naming conventions
    kafkaTopicDelimiter: "-",

    // gives you the option to alter mqtt messages before they are consumed (routed)
    subscribeEtl: (topic, message, packet, callback) => {
        // first param is an error, if you pass one, we will omit the message
        callback(null, {
            topic,
            message,
        });
    },

    // gives you the option to alter kafka messages before they are produced
    produceEtl: (topic, message, key, callback) => {
        // first param is an error, if you pass one, we will omit the message
        callback(null, {
            topic,
            message, // you can pass an object, will be turned into a string
            key, // default uuid.v4
            partition: null, // default null
        });
    },

    // the bridge starts an http server
    http: {
        port: 3967,
    },
};
