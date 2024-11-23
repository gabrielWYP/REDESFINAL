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
    string originalFolder = argv[2];
    string modifiedFolder = argv[3];
    string embedText = "TextoDe64CaracteresExactamenteParaEmbed64.";

    // Verificar que las carpetas existan o crearlas
    if (!fs::exists(originalFolder)) {
        fs::create_directories(originalFolder);
        cout << "Carpeta creada: " << originalFolder << endl;
    }

    if (!fs::exists(modifiedFolder)) {
        fs::create_directories(modifiedFolder);
        cout << "Carpeta creada: " << modifiedFolder << endl;
    }

    // Crear las rutas de destino
    string originalFilePath = fs::path(originalFolder) / fs::path(inputFilePath).filename();
    string modifiedFilePath = fs::path(modifiedFolder) / fs::path(inputFilePath).filename();

    // Copiar el archivo original a la carpeta de originales
    try {
        fs::copy(inputFilePath, originalFilePath, fs::copy_options::overwrite_existing);
        cout << "Archivo original guardado en: " << originalFilePath << endl;
    } catch (const fs::filesystem_error& e) {
        cerr << "Error al copiar el archivo original: " << e.what() << endl;
        return 1;
    }

    // Embedir el texto y guardar el archivo modificado
    embedTextInFile(inputFilePath, modifiedFilePath, embedText);

    return 0;
}