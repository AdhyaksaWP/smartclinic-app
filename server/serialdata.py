import serial
import re

class SerialData():
    def __init__(self):
        self.pattern = r'^[\d+\.\d+]+$'
        self.pattern_oxymeter = r'^[\d+\.\d+\,\d+\.\d+]+$'
        self.sensor_data = None  
    
    def sensor_readings(self, current_sensor):
        print("The current sensor being fetched is:", current_sensor)
        try:
            with serial.Serial("/dev/ttyUSB0", 115200, timeout=1) as esp32:
                print("Fetching sensor data")
                command_map = {
                    "Height": b'1', 
                    "Weight": b'2', 
                    "Temperature": b'3', 
                    "Oxymeter": b'4', 
                    "Tensimeter": b'5'
                }
                
                if current_sensor in command_map:
                    esp32.write(command_map[current_sensor]) 

                # Wait and read multiple times to ensure data is received
                while True:  
                    output = esp32.readline().decode('utf-8').strip()
                    print("Received from ESP32:", output)
                    if current_sensor == "Oxymeter":
                        if re.match(self.pattern_oxymeter, output):
                            self.sensor_data = [float(x) for x in output.split(",")]
                            print("Updated sensor data:", self.sensor_data)
                            return self.sensor_data
                    
                    elif re.match(self.pattern, output):
                        self.sensor_data = float(output)  
                        print("Updated sensor data:", self.sensor_data)
                        return self.sensor_data
                
        except Exception as e:
            print(f"Error reading from ESP32: {e}")
            return None
