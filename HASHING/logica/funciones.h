#include <iostream>
#include <bitset>
#include <vector>
#include <string> 
#include <map> 
#include <sstream> 
#include <fstream>
#include <iomanip>
using namespace std;

void embedTextInFile(const std::string& inputFilePath,const std::string& outputFilePath,const std::string& text);
void extractLast64Chars(const string& filePath);
string convertirASCII(string a);
string palabraPadeada( string a);
vector<string> numerobinarioIncial(string a);   
vector<string>  hashearvalorInicial (void);
bool esPrimo (int num);
void mostrar( vector<string>  ar);
vector<string>  constantesHashing(void);
vector<string> funcionW(vector<string> numprincipal);
string funcionROTR(string num, int rotr);
string funcionShift(string num, int rotr);
string funcionSigma (string num, int sigma);
string choose( string num1, string num2, string num3);
string mayority ( string num1, string num2, string num3);
string verificar( string num1, string num2, string num3);
string funcionT(int tnum, vector<string> letras, vector<string> klista, vector<string> wlista, int conta);
vector<string> creandoH( vector<string> letras, vector<string> klista, vector<string> wlista);
string SHA256vector(vector<string> principal, vector<string> letras);
string SHA256HEX (string num);
string SHA256(string palabra);
vector<string> desplazarVector(const vector<string>& original);


