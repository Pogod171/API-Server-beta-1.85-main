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
    if (
      (op === " " || op === "-" || op === "*" || op === "/" || op === "%") &&
      this.nbParams !== 3
    ) {
      // Invalid number of parameters for x and y operations
      error =
        "Nombre incorrect de paramètres pour les opérations avec 'x' et 'y'. Il doit y avoir 4 paramètres.";
    } else if (
      (op === "!" || op === "p" || op === "np") &&
      this.nbParams !== 2
    ) {
      // Invalid number of parameters for n operations
      error =
        "Nombre incorrect de paramètres pour les opérations avec 'n'. Il doit y avoir 3 paramètres.";
    }

    // Check if there is an error, and if so, prevent the switch block
    if (error != null) {
      this.HttpContext.response.JSON({ ...this.params, error: error });
      return; // Exit the function early
    }
    switch (op) {
      case "!":
        if (!isNaN(n) && Number.isSafeInteger(n) && n > 0) {
          if (n < 0) {
            error =
              "La factorielle n'est pas définie pour les nombres négatifs.";
          } else {
            result = this.factorial(n);
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre entier.";
        }
        break;

      case "p":
        if (!isNaN(n) && Number.isSafeInteger(n) && n > 0) {
          result = this.isPrime(n);
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre entier.";
        }
        break;

      case "np":
        if (!isNaN(n) && Number.isSafeInteger(n) && n > 0) {
          if (n <= 0) {
            error = "Entrée invalide. 'n' doit être un entier positif.";
          } else {
            result = this.findPrime(n);
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
        if (!isNaN(x) && !isNaN(y) && y !== 0 && x !== 0) {
          result = x / y;
        } else if (y === 0) {
          result = x === 0 ? "NaN" : "Infinity";
        } else {
          error =
            "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
        break;

      case "%":
        if (!isNaN(x) && !isNaN(y) && y !== 0 && x !== 0) {
          result = x % y;
        } else if (y === 0 || x === 0) {
          result = "NaN";
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
      reponse = {
        ...this.params,
        error: error,
        op: op === " " ? "+" : op,
      };
    } else {
      reponse = {
        ...this.params,
        value: result,
        op: op === " " ? "+" : op,
      };
    }
    this.HttpContext.response.JSON(reponse);
  }
  factorial(n) {
    if (n === 0 || n === 1) {
      return 1;
    }
    return n * factorial(n - 1);
  }
  isPrime(value) {
    for (var i = 2; i < value; i++) {
      if (value % i === 0) {
        return false;
      }
    }
    return value > 1;
  }
  findPrime(n) {
    let primeNumer = 0;
    for (let i = 0; i < n; i++) {
      primeNumer++;
      while (!isPrime(primeNumer)) {
        primeNumer++;
      }
    }
    return primeNumer;
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
