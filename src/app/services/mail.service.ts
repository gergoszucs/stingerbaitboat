import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class MailService {
    constructor(private firestore: AngularFirestore, private decimalPipe: DecimalPipe) { }

    public sendMail(order: Order) {
        return this.firestore.collection('mail').add({
            to: order.email,
            message: {
                subject: "Rendelés visszaigazolás",
                html: `
              <p>Kedves ${order.name}!</p>

              <p>Köszönjük a megrendelésed, melyet az alábbi adatokkal rögzítettünk.</p>
              
              <h4>Személyes adatok</h4>
              
              <ul>
                  <li><strong>Név:</strong> ${order.name}</li>
                  <li><strong>Email:</strong> ${order.email}</li>
                  <li><strong>Telefon:</strong> ${order.phone}</li>
                  <li><strong>Cím:</strong> ${order.address}</li>
              </ul>
              
              <h4>Hajó és tartozékai</h4>
              
              <ul>
                  <li><strong>Etetőhajó:</strong> ${order.boat}</li>
                  <li><strong>Szín:</strong> ${order.color}</li>
                  <li><strong>Radar:</strong> ${order.radar === "Nem kérem" ? 'Nem kérem ❌' : order.radar}</li>
                  <li><strong>Autopilóta:</strong> ${order.autopilot === "Nem kérem" ? 'Nem kérem ❌' : order.autopilot}</li>
                  <li><strong>Egyéb kiegészítők</strong>
                  <ul>
                      <li><strong>Pót akkumulátor:</strong> ${order.battery === "Nem kérem" ? 'Nem kérem ❌' : order.battery}</li>
                      <li><strong>Hajó és távírányító táska:</strong> ${order.bag ? 'Kérem ✅' : 'Nem kérem ❌'}</li>
                      <li><strong>Reflektor:</strong> ${order.light ? 'Kérem ✅' : 'Nem kérem ❌'}</li>
                      <li><strong>Hínárvédő:</strong> ${order.seaweed ? 'Kérem ✅' : 'Nem kérem ❌'}</li>
                  </ul>
                  </li>
              </ul>

              <h4>Általános információ</h4>
              
              <p>A hajóra és tartozékaira (kivéve akkumulátor) 2 + 1 év saját garancia van.</p>
              
              <p>Esetleges házhoz szálítás ára 10.000 Ft. Ezt az összeget a szállítás napján kell elutalni.</p>
              
              <p>Személyes, ingyenes átvétel helye: 1162 Budapest, Patkószeg utca 4. Lehetőség szerint a Lupa tavon együtt ki is próbáljuk a hajót. </p>
              
              <p>Rendelés várható elkészülése: 2023.03.</p>

              <p>Rendelés összege: ${this.decimalPipe.transform(order.price, '1.0-0') + " Ft"}</p>

              <p>A fizetés mindig két részletben történik, az első részletet előre kell utalni!</p>

              <p>A második részlet minden esetben 60 ezer forint, amit az átvételnél kell kifizetni!</p>

              <p>A pénz beérkezésére 3 munkanap áll rendelkezésre, különben a rendelés törlődik!</p>
              
              <h4>Utalás adatai</h4>
              
              <ul>
                  <li><strong>Utalandó összege:</strong> ${this.decimalPipe.transform(order.price - 60000, '1.0-0') + " Ft"}.</li>
                  <li><strong>Bankszámla:</strong> 11773164-00393263</li>
                  <li><strong>Név:</strong> Szabó Bernát</li>
                  <li><strong>Bank:</strong> OTP</li>
                  <li><strong>Megjegyzés rovatba kérlek írd be:</strong> ${order.name}</li>
              </ul>
              
              <p><br />
              Tisztelettel,<br />
              Szabó Bernát<br />
              +36-30/349-54-77</p>
              `,
            },
        });
    }
}
