// Ultrasonic - Library for HR-SC04 Ultrasonic Ranging Module.
// Rev.4 (06/2012)
// J.Rodrigo ( www.jra.so )
// more info at www.ardublog.com
 
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
