#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define PIR_PIN 18   // PIR sensor connected to GPIO 18
#define DHT_PIN 5    // DHT11 connected to GPIO 5
#define DHT_TYPE DHT11  // Define sensor type as DHT11

DHT dht(DHT_PIN, DHT_TYPE); // Initialize DHT sensor
int mode = 0; // Variable to store user input

void setup() {
    Serial.begin(115200);
    pinMode(PIR_PIN, INPUT); // Set PIR sensor as input
    dht.begin();  // Start the DHT sensor
}

void loop() {
    if (Serial.available() > 0) {
        mode = Serial.parseInt(); // Read user input (1 or 2)
        Serial.println("Mode Set: " + String(mode));
    }

    if (mode == 1) {
        // Read PIR sensor
        int motion = digitalRead(PIR_PIN);
        if (motion == HIGH) {
            Serial.println(1.0);
        } else {
            Serial.println(0.0);
        }
    } 
    
    else if (mode == 4) {
        // Read DHT11 sensor
        float temperature = dht.readTemperature(); // Read temperature in Celsius
        float humidity = dht.readHumidity(); // Read humidity

        // Check if readings are valid
        if (isnan(temperature) || isnan(humidity)) {
            Serial.println("Failed to read from DHT sensor!");
        } else {
            Serial.print(temperature);
            Serial.print(",");
            Serial.print(humidity);
        }
    }

    delay(2000); // Wait 2 seconds before reading again
}
