#include "funciones.h"

int main(int argc, char* argv[]) {
    /* Validar que se haya proporcionado un argumento (la ruta del archivo)
    if (argc < 2) {
        cerr << "Por favor, proporcione la ruta del archivo como argumento." << endl;
        return 1;
    }

    string rutaArchivo = argv[1]; // Obtener la ruta del archivo desde los argumentos

    cout << "rutaArchivo" << '\n';

    try {
        // Calcular el hash directamente con la ruta
        string hash = SHA256(rutaArchivo);

        // Mostrar el hash resultante
        cout << hash << endl; // El hash se mostrará en la salida estándar
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    */
    cout << "Escribe el archivo a hashear: " << endl;
    string rutaArchivo;
    cin >> rutaArchivo;
    try {
        string rpta = SHA256(rutaArchivo);
        cout << "El valor hash es de: " << rpta << endl;
    } catch (const exception& e) {
        cerr << "Error: " << e.what() << endl;
        return 1;
    }
    return 0;
}
