import time
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class SendToChatbot:
    def __init__(self, driver, wait):
        self.driver = driver
        self.wait = wait
    
    def target_chat (self, target):
        print("Target chat", target)
        contact_path = f'//span[@title="{target}"]'

        try:
            print("Trying to locate target chat", target)
            contact = self.wait.until(EC.presence_of_element_located((By.XPATH, contact_path)))
            time.sleep(10)
            contact.click()
            time.sleep(10)
            
        except Exception as e:
            print(f"Error locating contact: {e}")
            self.driver.quit()
            exit(1)

    def sendcsv(self, serial_value):
        assessment = "Saya telah melaksanakan medical check-up dengan hasil sebagai berikut, " \
        "menurut anda apakah dari hasil tersebut saya memiliki permasalahan kesehatan? " \
        f"{serial_value}"

        # for key, value in serial_value.items():
        #     assessment += f"{key}: {value}, "

        msg_bar_path = '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div[2]/div[1]/p'
        msg_bar = self.wait.until(EC.element_to_be_clickable((By.XPATH, msg_bar_path)))
        msg_bar.click()
        time.sleep(1)
        
        msg_bar.send_keys(assessment)
        msg_bar.send_keys(Keys.RETURN)
        time.sleep(10)
    
    def send_questions(self, data):
        msg_bar_path = '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div[2]/div[1]/p'
        msg_bar = self.wait.until(EC.element_to_be_clickable((By.XPATH, msg_bar_path)))
        msg_bar.click()
        time.sleep(1)
        
        msg_bar.send_keys(data)
        msg_bar.send_keys(Keys.RETURN)
        time.sleep(10)
        

    def scrape_chat(self):
        try:
            msg_path = '//*[@id="main"]/div[3]/div/div[2]/div[3]//div[@role="row"]'
            text_path = './/div//span[@dir="ltr"]/span'  # Search deeper inside `msg`

            # Get all elements matching msg_path and select the last one
            msg_elements = self.wait.until(EC.presence_of_all_elements_located((By.XPATH, msg_path)))
            last_msg = msg_elements[-1]  # Get the last element

            # Now, find the span inside the last message
            text_element = last_msg.find_element(By.XPATH, text_path)
            text_to_str = text_element.text  # Extract the text

            print("Scraped message:", text_to_str)
            return text_to_str
        except Exception as e:
            print(f"Error scraping chat: {e}")
            self.driver.quit()
            exit(1)
