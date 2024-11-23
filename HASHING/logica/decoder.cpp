#include <iostream>
#include <fstream>
#include <string>
#include "funciones.h"
using namespace std;

int main(int argc, char* argv[]) {

    if (argc < 2) {
        cerr << "Uso: " << argv[0] << " <ruta archivo original> <carpeta modificados> <timeStamp> " << endl;
        return 1;
    }


    string filepath = argv[1];
    extractLast64Chars(filepath);
    return 0;

}