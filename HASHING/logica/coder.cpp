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
        cerr << "Uso: " << argv[0] << " <ruta archivo original> <carpeta modificados> <timeStamp> " << endl;
        return 1;
    }

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

    // Embedir el texto y guardar el archivo modificado
    try {
        embedTextInFile(inputFilePath, modifiedFilePath, embedText);
    } catch (const std::runtime_error& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }

    return 0;
}