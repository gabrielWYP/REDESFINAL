#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include "funciones.h"


using namespace std;
namespace fs = std::filesystem;


int main(int argc, char* argv[]) {
    // Validar que se haya proporcionado un argumento (la ruta del archivo)
    if (argc < 4) {
        cerr << "Uso: " << argv[0] << " <ruta archivo original> <carpeta originales> <carpeta modificados>" << endl;
        return 1;
    }

    // Obtener los parámetros desde los argumentos
    string inputFilePath = argv[1];
    string modifiedFolder = argv[2];
    string timeStamp = argv[3];

    string embedText = SHA256(timeStamp);

    if (!fs::exists(modifiedFolder)) {
        fs::create_directories(modifiedFolder);
        cout << "Carpeta creada: " << modifiedFolder << endl;
    }

    // Crear las rutas de destino
    string modifiedFilePath = (fs::path(modifiedFolder) / fs::path(inputFilePath).filename()).string();

    // Copiar el archivo original a la carpeta de originales

    // Embedir el texto y guardar el archivo modificado
    embedTextInFile(inputFilePath, modifiedFilePath, embedText);

    return 0;
}