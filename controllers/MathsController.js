import Controller from "./Controller.js";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
  }

  get() {
    const op = this.HttpContext.path.params.op;

    if (op != null) {
      let result;
      let error;

      if (op === "!") {
        const n = parseFloat(this.HttpContext.path.params.n);

        if (!isNaN(n)) {
          if (n < 0) {
            error = "La factorielle n'est pas définie pour les nombres négatifs.";
          } else {
            result = 1;
            for (let i = 1; i <= n; i++) {
              result *= i;
            }
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre valide.";
        }
      } else if (op === "p") {
        const n = parseFloat(this.HttpContext.path.params.n);

        if (!isNaN(n)) {
          if (n <= 1) {
            result = false;
          } else if (n <= 3) {
            result = true;
          } else if (n % 2 === 0 || n % 3 === 0) {
            result = false;
          } else {
            let i = 5;
            while (i * i <= n) {
              if (n % i === 0 || n % (i + 2) === 0) {
                result = false;
                break;
              }
              i += 6;
            }
            result = true;
          }
        } else {
          error = "Paramètre 'n' invalide. 'n' doit être un nombre valide.";
        }
      }else if (op === "np") {
        const n = parseFloat(this.HttpContext.path.params.n);

        if (!isNaN(n)) {
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
          error = "Paramètre 'n' invalide. 'n' doit être un nombre valide.";
        }
      }
      else if ([' ', "-", "*", "/", "%"].includes(op)) {
        const x = parseFloat(this.HttpContext.path.params.x);
        const y = parseFloat(this.HttpContext.path.params.y);

        if (!isNaN(x) && !isNaN(y)) {
          switch (op) {
            case " ":
              result = x + y;
              break;
            case "-":
              result = x - y;
              break;
            case "*":
              result = x * y;
              break;
            case "/":
              if (y !== 0) {
                result = x / y;
              } else {
                error = "La division par zéro n'est pas autorisée.";
              }
              break;
            case "%":
              result = x % y;
              break;
          }
        } else {
          error = "Paramètres 'x' ou 'y' invalides. Les deux doivent être des nombres valides.";
        }
      } else {
        error = "Opérateur invalide. Les opérateurs supportés sont '+', '-', '*', '/', '%', et '!'.";
      }

      if (error != null) {
        this.HttpContext.response.JSON({ op: op, error: error });
      } else {
        this.HttpContext.response.JSON({ op: op, value: result });
      }
    } else {
      this.HttpContext.response.badRequest(
        "Paramètre 'op' invalide ou manquant. Veuillez fournir un opérateur valide ('+', '-', '*', '/', '%', ou '!')."
      );
    }
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
}