#include <iostream>
#include <fstream>
#include <string>

void embedTextInFile(const std::string& inputFilePath, 
                     const std::string& outputFilePath, 
                     const std::string& text) {
    // Verificar que el texto tenga 40 caracteres
    if (text.size() != 64) {
        std::cerr << "El texto debe tener exactamente 64 caracteres." << std::endl;
        return;
    }

    // Abrir el archivo original en modo binario
    std::ifstream inputFile(inputFilePath, std::ios::binary);
    if (!inputFile) {
        std::cerr << "Error al abrir el archivo original." << std::endl;
        return;
    }

    // Crear el archivo de salida en modo binario
    std::ofstream outputFile(outputFilePath, std::ios::binary);
    if (!outputFile) {
        std::cerr << "Error al crear el archivo de salida." << std::endl;
        return;
    }

    // Copiar el contenido del archivo original al archivo de salida
    outputFile << inputFile.rdbuf();

    // Escribir los 40 caracteres al final del archivo de salida
    outputFile.write(text.c_str(), text.size());

    std::cout << "Texto embebido y archivo guardado en: " << outputFilePath << std::endl;
}

int main() {
    // Ruta al archivo original y de salida
    std::string inputFile;
    std::string outputFile;

    std::cout << "Ingresa el archivo a modificar: " << std::endl;
    std::cin >> inputFile;
    std::cout << "Ingresa el archivo de fin: " << std::endl;
    std::cin >> outputFile;

    // Texto a insertar (exactamente 40 caracteres)
    std::string hiddenText = "3b19ecec8f4a23b9671d62879be605464c70365a2e507ee79a8f03687119848a";

    embedTextInFile(inputFile, outputFile, hiddenText);

    return 0;
}
