#include <iostream>
#include <fstream>
#include <string>
using namespace std;

void extractLast64Chars(const string& filePath) {
    // Abrir el archivo en modo binario
    std::ifstream inputFile(filePath, std::ios::binary);
    if (!inputFile) {
        std::cerr << "Error al abrir el archivo." << std::endl;
        return;
    }

    // Mover el cursor al final menos 40 bytes
    inputFile.seekg(0, std::ios::end); // Ir al final del archivo
    std::streampos fileSize = inputFile.tellg(); // Obtener tamaño del archivo

    if (fileSize < 64) {
        std::cerr << "El archivo tiene menos de 64 bytes, no se puede leer." << std::endl;
        return;
    }

    inputFile.seekg(-64, std::ios::end); // Mover 40 bytes antes del final

    // Leer los últimos 40 caracteres
    char buffer[65] = {0}; // Crear un buffer para los 40 caracteres más el terminador nulo
    inputFile.read(buffer, 64); // Leer exactamente 40 bytes

    // Imprimir el texto extraído
    std::cout << "Últimos 64 caracteres del archivo: " << buffer << std::endl;
}

int main() {
    string filepath;
    cout << "Selecciona el archivo: " << endl;
    cin >> filepath;
    extractLast64Chars(filepath);

    return 0;

}