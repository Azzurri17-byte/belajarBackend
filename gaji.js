const promptSync = require('prompt-sync')
const prompt = promptSync()

function programGaji() {
let gaji = Number(3700000)
const namaKaryawan = prompt("Masukkan nama karyawan: ")
const kehadiran = Number(prompt("Masukkan ketidakhadiran karyawan: "))
let denda = 1/100 * kehadiran * gaji
const bonus = 20/100 * gaji
const hasilBonus = gaji + bonus
const hasilDenda = gaji - denda

if (kehadiran == 0) {
    console.log('Nama karyawan ' + namaKaryawan +' dengan jumlah ketidakhadiran ' + kehadiran + ' mendapat gaji sebanyak Rp.' + gaji.toLocaleString('id-ID') + ' + bonus Rp.' + bonus.toLocaleString('id-ID') + ' menjadi = ' + hasilBonus.toLocaleString('id-ID'))
}
else if (kehadiran > 0) {
    const izin = prompt("Apakah karyawan izin?: (y/n) ")
    if (izin == "y".toLocaleLowerCase()) {
        let totalIzin = prompt("Berapa total karyawan sudah mengajukan izin tahun ini?: ")
        if (totalIzin < 12) {
            console.log('Nama karyawan ' + namaKaryawan + ' mendapat gaji tetap sebanyak Rp.' + gaji.toLocaleString('id-ID'))
        }
        else if (totalIzin > 12) {
            batasIzin = totalIzin - 12
            denda = 1/100 * batasIzin * gaji
            const dendaBatasIzin = gaji - denda
            console.log('Nama karyawan ' + namaKaryawan + ' karyawan melebihi batas izin sebanyak ' + batasIzin + '. Karyawan mendapat gaji sebanyak Rp.' + gaji.toLocaleString('id-ID') + ' dengan denda sebanyak Rp.' + denda.toLocaleString('id-ID') + ' menjadi = ' + dendaBatasIzin.toLocaleString('id-ID'))
        }
    }
    else {
            console.log('Nama karyawan ' + namaKaryawan + ' dengan jumlah ketidakhadiran ' + kehadiran + ' mendapat gaji sebanyak Rp.' + gaji.toLocaleString('id-ID') + ' dengan denda sebanyak ' + denda.toLocaleString('id-ID') + ' menjadi = ' + hasilDenda.toLocaleString('id-ID'))
    }
}
    return true
}

while (true) {
    if (programGaji()) {
        const restart = prompt("Lanjut program?: (y/n) ")
        if (restart != "y") {
            break
        }
    }
}


// console.log("Mulai pesan")

// setTimeout(() => {
//     console.log("makanan siap")
// }, 3000)

// console.log("antar ke pelanggan");