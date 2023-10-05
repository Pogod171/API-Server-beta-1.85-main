import Controller from "./Controller.js";
import path from "path";
import fs from "fs";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
    this.params = this.HttpContext.path.params;
    this.nbParams = Object.keys(this.params).length;
  }

  doOperation() {
    let op = this.params.op;
    const x = parseFloat(this.params.x);
    const y = parseFloat(this.params.y);
    const n = parseFloat(this.params.n);
    let result;
    let error;

    switch (op) {
      case "!":
        if (!isNaN(n) && Number.isSafeInteger(n)) {
          if (n < 0) {
            error = "La factorielle n'est pas définie pour les nombres négatifs.";
          } else {
            result = 1;
            for (let i = 1; i <= n; i++) {
              result *= i;
            }
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre entier.";
        }
        break;

      case "p":
        if (!isNaN(n) && Number.isSafeInteger(n)) {
          if (n <= 1) {
            result = false;
          } else if (n <= 3 || n % 2 === 0 || n % 3 === 0) {
            result = true;
          } else {
            let i = 5;
            while (i * i <= n) {
              if (n % i === 0 || n % (i + 2) === 0) {
                result = false;
                break;
              }
              i += 6;
            }
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre entier.";
        }
        break;

      case "np":
        if (!isNaN(n) && Number.isSafeInteger(n)) {
          if (n <= 0) {
            error = "Entrée invalide. 'n' doit être un entier positif.";
          } else {
            let count = 0;
            let num = 2;
            while (true) {
              if (this.isPrime(num)) {
                count++;
                if (count === n) {
                  result = num;
                  break;
                }
              }
              num++;
            }
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre entier.";
        }
        break;

      case " ":
        if (!isNaN(x) && !isNaN(y)) {
          result = x + y;
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      case "-":
        if (!isNaN(x) && !isNaN(y)) {
          result = x - y;
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      case "*":
        if (!isNaN(x) && !isNaN(y)) {
          result = x * y;
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      case "/":
        if (!isNaN(x) && !isNaN(y) && y !== 0) {
          result = x / y;
        } else if (y === 0) {
          error = "La division par zéro n'est pas autorisée.";
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      case "%":
        if (!isNaN(x) && !isNaN(y) && y !== 0 && x !== 0) {
          result = x % y;
        } else if (y === 0 || x === 0) {
          error = "Le modulo par zéro n'est pas autorisé.";
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      default:
        error =
          "Opérateur invalide. Les opérateurs supportés sont '+', '-', '*', '/', '%', et '!'.";
        break;
    }

    let reponse;

    if (error != null) {
      reponse = { ...this.params, error: error };
    } else {
      reponse = { ...this.params, value: result };
    }
    this.HttpContext.response.JSON(reponse);
  }

  isPrime(n) {
    if (n <= 1) {
      return false;
    }
    if (n <= 3) {
      return true;
    }
    if (n % 2 === 0 || n % 3 === 0) {
      return false;
    }
    let i = 5;
    while (i * i <= n) {
      if (n % i === 0 || n % (i + 2) === 0) {
        return false;
      }
      i += 6;
    }
    return true;
  }

  help() {
    let helpPagePath = path.join(
      process.cwd(),
      wwwroot,
      "API-Help-Pages/API-Maths-Help.html"
    );
    this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
  }

  get() {
    if (this.HttpContext.path.queryString == "?") this.help();
    else this.doOperation();
  }
}
