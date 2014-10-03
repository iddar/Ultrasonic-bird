#include <Ultrasonic.h>
 
Ultrasonic ultrasonic(12,11); // (Trig PIN,Echo PIN)
int ultimaLectura=0, lecturaActual=0;
 
void setup() {
  Serial.begin(9600); 
}
 
void loop()
{ 
  lecturaActual = ultrasonic.Ranging(CM);
  if(lecturaActual > ultimaLectura + 3 || lecturaActual < ultimaLectura - 3){
    Serial.print("{\"sensor\":\"");
    Serial.print( lecturaActual );
    Serial.print("\"}\n"); 
    ultimaLectura = lecturaActual;
  }
  delay(10);
}
