/**
 * Auto-generated Supabase database types from schema introspection.
 * Generated for Karisma Store / ecommerce-nextjs.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      "tbl_itemserialdt": {
        Row: {
          "noserial": string | null
          "iddttransfin": string | null
          "notransfin": string | null
          "iddttrsrm": string | null
          "notrsrm": string | null
          "iddttrsk": string | null
          "iddttrskrakit": string | null
          "notrsk": string | null
          "iddttransfout": string | null
          "notransfout": string | null
          "iddtop": string | null
          "notrsop": string | null
          "iddttrsm": string | null
          "notrsm": string | null
        }
        Insert: {
          "noserial"?: string | null
          "iddttransfin"?: string | null
          "notransfin"?: string | null
          "iddttrsrm"?: string | null
          "notrsrm"?: string | null
          "iddttrsk"?: string | null
          "iddttrskrakit"?: string | null
          "notrsk"?: string | null
          "iddttransfout"?: string | null
          "notransfout"?: string | null
          "iddtop"?: string | null
          "notrsop"?: string | null
          "iddttrsm"?: string | null
          "notrsm"?: string | null
        }
        Update: {
          "noserial"?: string | null
          "iddttransfin"?: string | null
          "notransfin"?: string | null
          "iddttrsrm"?: string | null
          "notrsrm"?: string | null
          "iddttrsk"?: string | null
          "iddttrskrakit"?: string | null
          "notrsk"?: string | null
          "iddttransfout"?: string | null
          "notransfout"?: string | null
          "iddtop"?: string | null
          "notrsop"?: string | null
          "iddttrsm"?: string | null
          "notrsm"?: string | null
        }
        Relationships: []
      }
      "tbl_acc_sa": {
        Row: {
          "kodeacc": string
          "tanggal": string | null
          "matauang": string | null
          "rate": number | null
          "jumlah": number | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
        }
        Insert: {
          "kodeacc": string
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
        }
        Update: {
          "kodeacc"?: string | null
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_itemrakitan": {
        Row: {
          "iddetail": string
          "kodeitem": string | null
          "kodeitemrakitan": string | null
          "jumlah": number | null
          "satuan": string | null
          "harga": number | null
          "total": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_acc_tmplrnr": {
        Row: {
          "kodeacc": string | null
          "urut": number | null
          "tipeacc": string | null
          "sub1": string | null
          "sub2": string | null
          "sub3": string | null
          "sub4": string | null
          "sub5": string | null
          "sub6": string | null
          "nilai": number | null
          "setsub": number | null
          "usergen": string | null
        }
        Insert: {
          "kodeacc"?: string | null
          "urut"?: number | null
          "tipeacc"?: string | null
          "sub1"?: string | null
          "sub2"?: string | null
          "sub3"?: string | null
          "sub4"?: string | null
          "sub5"?: string | null
          "sub6"?: string | null
          "nilai"?: number | null
          "setsub"?: number | null
          "usergen"?: string | null
        }
        Update: {
          "kodeacc"?: string | null
          "urut"?: number | null
          "tipeacc"?: string | null
          "sub1"?: string | null
          "sub2"?: string | null
          "sub3"?: string | null
          "sub4"?: string | null
          "sub5"?: string | null
          "sub6"?: string | null
          "nilai"?: number | null
          "setsub"?: number | null
          "usergen"?: string | null
        }
        Relationships: []
      }
      "tbl_itemdispdt": {
        Row: {
          "kodeitem": string | null
          "satuan": string | null
          "opsidiskon": number | null
          "diskon1": number | null
          "diskon2": number | null
          "diskon3": number | null
          "diskon4": number | null
          "disknom1": number | null
          "disknom2": number | null
          "disknom3": number | null
          "disknom4": number | null
          "iddiskon": string | null
        }
        Insert: {
          "kodeitem"?: string | null
          "satuan"?: string | null
          "opsidiskon"?: number | null
          "diskon1"?: number | null
          "diskon2"?: number | null
          "diskon3"?: number | null
          "diskon4"?: number | null
          "disknom1"?: number | null
          "disknom2"?: number | null
          "disknom3"?: number | null
          "disknom4"?: number | null
          "iddiskon"?: string | null
        }
        Update: {
          "kodeitem"?: string | null
          "satuan"?: string | null
          "opsidiskon"?: number | null
          "diskon1"?: number | null
          "diskon2"?: number | null
          "diskon3"?: number | null
          "diskon4"?: number | null
          "disknom1"?: number | null
          "disknom2"?: number | null
          "disknom3"?: number | null
          "disknom4"?: number | null
          "iddiskon"?: string | null
        }
        Relationships: []
      }
      "tbl_byrhutangitem": {
        Row: {
          "iddetail": string | null
          "iddetailitem": string | null
          "notransaksi": string | null
          "kodeitem": string | null
          "jmlretur": number | null
          "jmllaku": number | null
        }
        Insert: {
          "iddetail"?: string | null
          "iddetailitem"?: string | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jmlretur"?: number | null
          "jmllaku"?: number | null
        }
        Update: {
          "iddetail"?: string | null
          "iddetailitem"?: string | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jmlretur"?: number | null
          "jmllaku"?: number | null
        }
        Relationships: []
      }
      "tbl_userg": {
        Row: {
          "kelompok": string
          "urut": number | null
        }
        Insert: {
          "kelompok": string
          "urut"?: number | null
        }
        Update: {
          "kelompok"?: string | null
          "urut"?: number | null
        }
        Relationships: []
      }
      "tbl_itempotongan": {
        Row: {
          "iddetail": string
          "kodeitem": string | null
          "kodegrup": string | null
          "jumlah": number | null
          "pot1": number | null
          "pot2": number | null
          "pot3": number | null
          "pot4": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "kodeitem"?: string | null
          "kodegrup"?: string | null
          "jumlah"?: number | null
          "pot1"?: number | null
          "pot2"?: number | null
          "pot3"?: number | null
          "pot4"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "kodeitem"?: string | null
          "kodegrup"?: string | null
          "jumlah"?: number | null
          "pot1"?: number | null
          "pot2"?: number | null
          "pot3"?: number | null
          "pot4"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_item": {
        Row: {
          "kodeitem": string
          "namaitem": string | null
          "jenis": string | null
          "tipe": string | null
          "matauang": string | null
          "serial": string | null
          "konsinyasi": string | null
          "stokmin": number | null
          "sistemhargajual": string | null
          "opsihargajual": boolean | null
          "rak": string | null
          "satuan": string | null
          "hargapokok": number | null
          "prhargajual1": number | null
          "hargajual1": number | null
          "keterangan": string | null
          "supplier1": string | null
          "gambar": string | null
          "statusjual": string | null
          "acc_hpp": string | null
          "acc_pendapatan": string | null
          "acc_persediaan": string | null
          "acc_jasa": string | null
          "acc_noninventory": string | null
          "statushapus": string | null
          "tmphp": number | null
          "tmpjml": number | null
          "tmpnilai": number | null
          "dateupd": string | null
          "dept": string | null
          "stok": number | null
          "merek": string | null
          "nonpoint": string | null
          "opt": string | null
          "brgjasa_refcode": string | null
        }
        Insert: {
          "kodeitem": string
          "namaitem"?: string | null
          "jenis"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "serial"?: string | null
          "konsinyasi"?: string | null
          "stokmin"?: number | null
          "sistemhargajual"?: string | null
          "opsihargajual"?: boolean | null
          "rak"?: string | null
          "satuan"?: string | null
          "hargapokok"?: number | null
          "prhargajual1"?: number | null
          "hargajual1"?: number | null
          "keterangan"?: string | null
          "supplier1"?: string | null
          "gambar"?: string | null
          "statusjual"?: string | null
          "acc_hpp"?: string | null
          "acc_pendapatan"?: string | null
          "acc_persediaan"?: string | null
          "acc_jasa"?: string | null
          "acc_noninventory"?: string | null
          "statushapus"?: string | null
          "tmphp"?: number | null
          "tmpjml"?: number | null
          "tmpnilai"?: number | null
          "dateupd"?: string | null
          "dept"?: string | null
          "stok"?: number | null
          "merek"?: string | null
          "nonpoint"?: string | null
          "opt"?: string | null
          "brgjasa_refcode"?: string | null
        }
        Update: {
          "kodeitem"?: string | null
          "namaitem"?: string | null
          "jenis"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "serial"?: string | null
          "konsinyasi"?: string | null
          "stokmin"?: number | null
          "sistemhargajual"?: string | null
          "opsihargajual"?: boolean | null
          "rak"?: string | null
          "satuan"?: string | null
          "hargapokok"?: number | null
          "prhargajual1"?: number | null
          "hargajual1"?: number | null
          "keterangan"?: string | null
          "supplier1"?: string | null
          "gambar"?: string | null
          "statusjual"?: string | null
          "acc_hpp"?: string | null
          "acc_pendapatan"?: string | null
          "acc_persediaan"?: string | null
          "acc_jasa"?: string | null
          "acc_noninventory"?: string | null
          "statushapus"?: string | null
          "tmphp"?: number | null
          "tmpjml"?: number | null
          "tmpnilai"?: number | null
          "dateupd"?: string | null
          "dept"?: string | null
          "stok"?: number | null
          "merek"?: string | null
          "nonpoint"?: string | null
          "opt"?: string | null
          "brgjasa_refcode"?: string | null
        }
        Relationships: []
      }
      "ecommerce_orders": {
        Row: {
          "id": string
          "notransaksi": string
          "user_id": string
          "status_order": string
          "status_pembayaran": string
          "status_pengiriman": string
          "metode_pembayaran": string
          "total_belanja": number
          "ongkir": number
          "total_akhir": number
          "catatan": string | null
          "nama_penerima": string
          "telepon_penerima": string
          "alamat_kirim": string
          "created_at": string | null
          "updated_at": string | null
        }
        Insert: {
          "id"?: string | null
          "notransaksi": string
          "user_id": string
          "status_order": string
          "status_pembayaran": string
          "status_pengiriman": string
          "metode_pembayaran": string
          "total_belanja": number
          "ongkir"?: number | null
          "total_akhir": number
          "catatan"?: string | null
          "nama_penerima": string
          "telepon_penerima": string
          "alamat_kirim": string
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "notransaksi"?: string | null
          "user_id"?: string | null
          "status_order"?: string | null
          "status_pembayaran"?: string | null
          "status_pengiriman"?: string | null
          "metode_pembayaran"?: string | null
          "total_belanja"?: number | null
          "ongkir"?: number | null
          "total_akhir"?: number | null
          "catatan"?: string | null
          "nama_penerima"?: string | null
          "telepon_penerima"?: string | null
          "alamat_kirim"?: string | null
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Relationships: []
      }
      "tbl_supel_subwil": {
        Row: {
          "kode": string
          "subwilayah": string | null
        }
        Insert: {
          "kode": string
          "subwilayah"?: string | null
        }
        Update: {
          "kode"?: string | null
          "subwilayah"?: string | null
        }
        Relationships: []
      }
      "tbl_hupi_sa": {
        Row: {
          "kodesupel": string | null
          "tanggal": string | null
          "kode_acc": string | null
          "kodemu": string | null
          "jumlah": number | null
          "tipe": string | null
        }
        Insert: {
          "kodesupel"?: string | null
          "tanggal"?: string | null
          "kode_acc"?: string | null
          "kodemu"?: string | null
          "jumlah"?: number | null
          "tipe"?: string | null
        }
        Update: {
          "kodesupel"?: string | null
          "tanggal"?: string | null
          "kode_acc"?: string | null
          "kodemu"?: string | null
          "jumlah"?: number | null
          "tipe"?: string | null
        }
        Relationships: []
      }
      "tbl_tmp": {
        Row: {
          "cntprsjurnal": number | null
          "cntlevelrep": number | null
          "cntsortrep": number | null
          "cnt_im": number | null
        }
        Insert: {
          "cntprsjurnal"?: number | null
          "cntlevelrep"?: number | null
          "cntsortrep"?: number | null
          "cnt_im"?: number | null
        }
        Update: {
          "cntprsjurnal"?: number | null
          "cntlevelrep"?: number | null
          "cntsortrep"?: number | null
          "cnt_im"?: number | null
        }
        Relationships: []
      }
      "tbl_formatnotr": {
        Row: {
          "trid": string
          "nomor": number | null
          "slot1": string | null
          "slot2": string | null
          "slot3": string | null
          "slot4": string | null
          "slot5": string | null
          "sep1": string | null
          "sep2": string | null
          "sep3": string | null
          "sep4": string | null
          "resetid": string | null
          "numdgt": number | null
          "notransaksi": string | null
          "kantor": string
        }
        Insert: {
          "trid": string
          "nomor"?: number | null
          "slot1"?: string | null
          "slot2"?: string | null
          "slot3"?: string | null
          "slot4"?: string | null
          "slot5"?: string | null
          "sep1"?: string | null
          "sep2"?: string | null
          "sep3"?: string | null
          "sep4"?: string | null
          "resetid"?: string | null
          "numdgt"?: number | null
          "notransaksi"?: string | null
          "kantor": string
        }
        Update: {
          "trid"?: string | null
          "nomor"?: number | null
          "slot1"?: string | null
          "slot2"?: string | null
          "slot3"?: string | null
          "slot4"?: string | null
          "slot5"?: string | null
          "sep1"?: string | null
          "sep2"?: string | null
          "sep3"?: string | null
          "sep4"?: string | null
          "resetid"?: string | null
          "numdgt"?: number | null
          "notransaksi"?: string | null
          "kantor"?: string | null
        }
        Relationships: []
      }
      "tbl_rb_hutang": {
        Row: {
          "noretur": string | null
          "notrspot": string | null
          "jmlpot": number | null
        }
        Insert: {
          "noretur"?: string | null
          "notrspot"?: string | null
          "jmlpot"?: number | null
        }
        Update: {
          "noretur"?: string | null
          "notrspot"?: string | null
          "jmlpot"?: number | null
        }
        Relationships: []
      }
      "tbl_accdepositdt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeacc": string | null
          "matauang": string | null
          "rate": number | null
          "jumlah": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeacc"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeacc"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_kaslacidt": {
        Row: {
          "notransaksi": string
          "nama_pengambil": string | null
          "kas_keluar": number | null
          "keterangan_p": string | null
          "iddetail": string
        }
        Insert: {
          "notransaksi": string
          "nama_pengambil"?: string | null
          "kas_keluar"?: number | null
          "keterangan_p"?: string | null
          "iddetail": string
        }
        Update: {
          "notransaksi"?: string | null
          "nama_pengambil"?: string | null
          "kas_keluar"?: number | null
          "keterangan_p"?: string | null
          "iddetail"?: string | null
        }
        Relationships: []
      }
      "tbl_imrakitan": {
        Row: {
          "iddetail": string
          "iddetailtrs": string | null
          "notransaksi": string | null
          "tipe": string | null
          "kodeitem": string | null
          "kodeitemrakitan": string | null
          "jumlah": number | null
          "satuan": string | null
          "harga": number | null
          "total": number | null
          "jumlahtrs": number | null
          "satuantrs": string | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_supel_wil": {
        Row: {
          "kode": string
          "wilayah": string | null
        }
        Insert: {
          "kode": string
          "wilayah"?: string | null
        }
        Update: {
          "kode"?: string | null
          "wilayah"?: string | null
        }
        Relationships: []
      }
      "tbl_pesanrakitan": {
        Row: {
          "iddetail": string
          "iddetailtrs": string | null
          "notransaksi": string | null
          "tipe": string | null
          "kodeitem": string | null
          "kodeitemrakitan": string | null
          "jumlah": number | null
          "satuan": string | null
          "harga": number | null
          "total": number | null
          "jumlahtrs": number | null
          "satuantrs": string | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_conf": {
        Row: {
          "confname": string
          "confvalue": string | null
          "confblob": string | null
        }
        Insert: {
          "confname": string
          "confvalue"?: string | null
          "confblob"?: string | null
        }
        Update: {
          "confname"?: string | null
          "confvalue"?: string | null
          "confblob"?: string | null
        }
        Relationships: []
      }
      "tbl_supel": {
        Row: {
          "kode": string
          "tipe": string
          "nama": string | null
          "alamat": string | null
          "kota": string | null
          "provinsi": string | null
          "kodepos": string | null
          "negara": string | null
          "telepon": string | null
          "fax": string | null
          "kontak": string | null
          "email": string | null
          "matauang": string | null
          "norek": string | null
          "atasnama": string | null
          "bank": string | null
          "keterangan": string | null
          "limitjmlhupi": number | null
          "limitharihupi": number | null
          "tipepot": string | null
          "kgrup": string | null
          "pilkomisi": number | null
          "piljmlkomisi": number | null
          "komisipr": number | null
          "komisinom": number | null
          "npwp": string | null
          "harijt": number | null
          "kdwilayah": string | null
          "kdsubwil": string | null
          "kdsales": string | null
          "kdsales_kordinator": string | null
          "nik": string | null
          "nama_npwp": string | null
          "alamat_npwp": string | null
          "tgl_lahir": string | null
          "opsi_doc": string | null
          "paspor": string | null
          "other_id": string | null
          "email_pajak": string | null
          "idtku": string | null
          "buyercountry": string | null
        }
        Insert: {
          "kode": string
          "tipe": string
          "nama"?: string | null
          "alamat"?: string | null
          "kota"?: string | null
          "provinsi"?: string | null
          "kodepos"?: string | null
          "negara"?: string | null
          "telepon"?: string | null
          "fax"?: string | null
          "kontak"?: string | null
          "email"?: string | null
          "matauang"?: string | null
          "norek"?: string | null
          "atasnama"?: string | null
          "bank"?: string | null
          "keterangan"?: string | null
          "limitjmlhupi"?: number | null
          "limitharihupi"?: number | null
          "tipepot"?: string | null
          "kgrup"?: string | null
          "pilkomisi"?: number | null
          "piljmlkomisi"?: number | null
          "komisipr"?: number | null
          "komisinom"?: number | null
          "npwp"?: string | null
          "harijt"?: number | null
          "kdwilayah"?: string | null
          "kdsubwil"?: string | null
          "kdsales"?: string | null
          "kdsales_kordinator"?: string | null
          "nik"?: string | null
          "nama_npwp"?: string | null
          "alamat_npwp"?: string | null
          "tgl_lahir"?: string | null
          "opsi_doc"?: string | null
          "paspor"?: string | null
          "other_id"?: string | null
          "email_pajak"?: string | null
          "idtku"?: string | null
          "buyercountry"?: string | null
        }
        Update: {
          "kode"?: string | null
          "tipe"?: string | null
          "nama"?: string | null
          "alamat"?: string | null
          "kota"?: string | null
          "provinsi"?: string | null
          "kodepos"?: string | null
          "negara"?: string | null
          "telepon"?: string | null
          "fax"?: string | null
          "kontak"?: string | null
          "email"?: string | null
          "matauang"?: string | null
          "norek"?: string | null
          "atasnama"?: string | null
          "bank"?: string | null
          "keterangan"?: string | null
          "limitjmlhupi"?: number | null
          "limitharihupi"?: number | null
          "tipepot"?: string | null
          "kgrup"?: string | null
          "pilkomisi"?: number | null
          "piljmlkomisi"?: number | null
          "komisipr"?: number | null
          "komisinom"?: number | null
          "npwp"?: string | null
          "harijt"?: number | null
          "kdwilayah"?: string | null
          "kdsubwil"?: string | null
          "kdsales"?: string | null
          "kdsales_kordinator"?: string | null
          "nik"?: string | null
          "nama_npwp"?: string | null
          "alamat_npwp"?: string | null
          "tgl_lahir"?: string | null
          "opsi_doc"?: string | null
          "paspor"?: string | null
          "other_id"?: string | null
          "email_pajak"?: string | null
          "idtku"?: string | null
          "buyercountry"?: string | null
        }
        Relationships: []
      }
      "tbl_pesandt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeitem": string | null
          "jumlah": number | null
          "jmlterima": number | null
          "satuan": string | null
          "harga": number | null
          "potongan": number | null
          "total": number | null
          "pajak": number | null
          "dateupd": string | null
          "detinfo": string | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlterima"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "dateupd"?: string | null
          "detinfo"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlterima"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "dateupd"?: string | null
          "detinfo"?: string | null
        }
        Relationships: []
      }
      "tbl_acckashd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kodeacc": string | null
          "kodeaccto": string | null
          "tanggal": string | null
          "matauang": string | null
          "rate": number | null
          "tipe": string | null
          "jumlah": number | null
          "subtotal": number | null
          "keterangan": string | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "shiftkerja": string | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kodeacc"?: string | null
          "kodeaccto"?: string | null
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "tipe"?: string | null
          "jumlah"?: number | null
          "subtotal"?: number | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kodeacc"?: string | null
          "kodeaccto"?: string | null
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "tipe"?: string | null
          "jumlah"?: number | null
          "subtotal"?: number | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
        }
        Relationships: []
      }
      "tbl_accjurnal": {
        Row: {
          "iddetail": string
          "nourut": number | null
          "tipeinput": string | null
          "notransaksi": string | null
          "tanggal": string | null
          "kodeacc": string | null
          "jenis": string | null
          "keterangan": string | null
          "matauang": string | null
          "rate": number | null
          "jumlah": number | null
          "posisi": string | null
          "debet": number | null
          "kredit": number | null
          "kantor": string | null
        }
        Insert: {
          "iddetail": string
          "nourut"?: number | null
          "tipeinput"?: string | null
          "notransaksi"?: string | null
          "tanggal"?: string | null
          "kodeacc"?: string | null
          "jenis"?: string | null
          "keterangan"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "posisi"?: string | null
          "debet"?: number | null
          "kredit"?: number | null
          "kantor"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nourut"?: number | null
          "tipeinput"?: string | null
          "notransaksi"?: string | null
          "tanggal"?: string | null
          "kodeacc"?: string | null
          "jenis"?: string | null
          "keterangan"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "posisi"?: string | null
          "debet"?: number | null
          "kredit"?: number | null
          "kantor"?: string | null
        }
        Relationships: []
      }
      "tbl_point_sa": {
        Row: {
          "kodesupel": string
          "kodekantor": string | null
          "notransaksi": string | null
          "tanggal": string | null
          "tipe": string | null
          "point_ik": number | null
        }
        Insert: {
          "kodesupel": string
          "kodekantor"?: string | null
          "notransaksi"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "point_ik"?: number | null
        }
        Update: {
          "kodesupel"?: string | null
          "kodekantor"?: string | null
          "notransaksi"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "point_ik"?: number | null
        }
        Relationships: []
      }
      "tbl_ikhd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kantordari": string | null
          "tanggal": string | null
          "tipe": string | null
          "notrsorder": string | null
          "kodesupel": string | null
          "kodesales": string | null
          "kodesales2": string | null
          "kodesales3": string | null
          "kodesales4": string | null
          "matauang": string | null
          "rate": number | null
          "keterangan": string | null
          "totalitem": number | null
          "totalitempesan": number | null
          "subtotal": number | null
          "potfaktur": number | null
          "pajak": number | null
          "biayalain": number | null
          "totalakhir": number | null
          "carabayar": string | null
          "jmltunai": number | null
          "jmlkredit": number | null
          "jmldebit": number | null
          "jmlkk": number | null
          "komisi1": number | null
          "komisi2": number | null
          "komisi3": number | null
          "komisi4": number | null
          "acc_potongan": string | null
          "acc_pajak": string | null
          "acc_biayalain": string | null
          "acc_tunai": string | null
          "acc_kredit": string | null
          "acc_sales": string | null
          "acc_hpp": string | null
          "acc_debit": string | null
          "acc_kk": string | null
          "byr_krd_jt": string | null
          "byr_krd_no": string | null
          "byr_debit_bank": string | null
          "byr_kk_bank": string | null
          "byr_debit_no": string | null
          "byr_kk_no": string | null
          "krd_jml_pot": number | null
          "krd_jml_byr": number | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "tanggal_sa": string | null
          "biaya_msk_total": boolean | null
          "potnomfaktur": number | null
          "compname": string | null
          "shiftkerja": string | null
          "point_ik": number | null
          "point_sts": number | null
          "acc_biaya_pot": string | null
          "prpajak": number | null
          "nofp": string | null
          "dppesanan": number | null
          "acc_dppesanan": string | null
          "notrsretur": string | null
          "selisihpembulatan": number | null
          "acc_pend_pembulatan": string | null
          "jmlemoney": number | null
          "byr_emoney_no": string | null
          "byr_emoney_prod": string | null
          "acc_emoney": string | null
          "jmldeposit": number | null
          "acc_deposit": string | null
          "jenis_pajak": string | null
          "trxcode": string | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kantordari"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "notrsorder"?: string | null
          "kodesupel"?: string | null
          "kodesales"?: string | null
          "kodesales2"?: string | null
          "kodesales3"?: string | null
          "kodesales4"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "totalitem"?: number | null
          "totalitempesan"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "carabayar"?: string | null
          "jmltunai"?: number | null
          "jmlkredit"?: number | null
          "jmldebit"?: number | null
          "jmlkk"?: number | null
          "komisi1"?: number | null
          "komisi2"?: number | null
          "komisi3"?: number | null
          "komisi4"?: number | null
          "acc_potongan"?: string | null
          "acc_pajak"?: string | null
          "acc_biayalain"?: string | null
          "acc_tunai"?: string | null
          "acc_kredit"?: string | null
          "acc_sales"?: string | null
          "acc_hpp"?: string | null
          "acc_debit"?: string | null
          "acc_kk"?: string | null
          "byr_krd_jt"?: string | null
          "byr_krd_no"?: string | null
          "byr_debit_bank"?: string | null
          "byr_kk_bank"?: string | null
          "byr_debit_no"?: string | null
          "byr_kk_no"?: string | null
          "krd_jml_pot"?: number | null
          "krd_jml_byr"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "tanggal_sa"?: string | null
          "biaya_msk_total"?: boolean | null
          "potnomfaktur"?: number | null
          "compname"?: string | null
          "shiftkerja"?: string | null
          "point_ik"?: number | null
          "point_sts"?: number | null
          "acc_biaya_pot"?: string | null
          "prpajak"?: number | null
          "nofp"?: string | null
          "dppesanan"?: number | null
          "acc_dppesanan"?: string | null
          "notrsretur"?: string | null
          "selisihpembulatan"?: number | null
          "acc_pend_pembulatan"?: string | null
          "jmlemoney"?: number | null
          "byr_emoney_no"?: string | null
          "byr_emoney_prod"?: string | null
          "acc_emoney"?: string | null
          "jmldeposit"?: number | null
          "acc_deposit"?: string | null
          "jenis_pajak"?: string | null
          "trxcode"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kantordari"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "notrsorder"?: string | null
          "kodesupel"?: string | null
          "kodesales"?: string | null
          "kodesales2"?: string | null
          "kodesales3"?: string | null
          "kodesales4"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "totalitem"?: number | null
          "totalitempesan"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "carabayar"?: string | null
          "jmltunai"?: number | null
          "jmlkredit"?: number | null
          "jmldebit"?: number | null
          "jmlkk"?: number | null
          "komisi1"?: number | null
          "komisi2"?: number | null
          "komisi3"?: number | null
          "komisi4"?: number | null
          "acc_potongan"?: string | null
          "acc_pajak"?: string | null
          "acc_biayalain"?: string | null
          "acc_tunai"?: string | null
          "acc_kredit"?: string | null
          "acc_sales"?: string | null
          "acc_hpp"?: string | null
          "acc_debit"?: string | null
          "acc_kk"?: string | null
          "byr_krd_jt"?: string | null
          "byr_krd_no"?: string | null
          "byr_debit_bank"?: string | null
          "byr_kk_bank"?: string | null
          "byr_debit_no"?: string | null
          "byr_kk_no"?: string | null
          "krd_jml_pot"?: number | null
          "krd_jml_byr"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "tanggal_sa"?: string | null
          "biaya_msk_total"?: boolean | null
          "potnomfaktur"?: number | null
          "compname"?: string | null
          "shiftkerja"?: string | null
          "point_ik"?: number | null
          "point_sts"?: number | null
          "acc_biaya_pot"?: string | null
          "prpajak"?: number | null
          "nofp"?: string | null
          "dppesanan"?: number | null
          "acc_dppesanan"?: string | null
          "notrsretur"?: string | null
          "selisihpembulatan"?: number | null
          "acc_pend_pembulatan"?: string | null
          "jmlemoney"?: number | null
          "byr_emoney_no"?: string | null
          "byr_emoney_prod"?: string | null
          "acc_emoney"?: string | null
          "jmldeposit"?: number | null
          "acc_deposit"?: string | null
          "jenis_pajak"?: string | null
          "trxcode"?: string | null
        }
        Relationships: []
      }
      "profiles": {
        Row: {
          "id": string
          "email": string
          "nama": string | null
          "telepon": string | null
          "role": string
          "kode_supel": string | null
          "avatar_url": string | null
          "is_disabled": boolean | null
          "created_at": string | null
          "updated_at": string | null
        }
        Insert: {
          "id"?: string | null
          "email": string
          "nama"?: string | null
          "telepon"?: string | null
          "role": string
          "kode_supel"?: string | null
          "avatar_url"?: string | null
          "is_disabled"?: boolean | null
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "email"?: string | null
          "nama"?: string | null
          "telepon"?: string | null
          "role"?: string | null
          "kode_supel"?: string | null
          "avatar_url"?: string | null
          "is_disabled"?: boolean | null
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Relationships: []
      }
      "tbl_kantor": {
        Row: {
          "kodekantor": string
          "fungsi": string | null
          "namakantor": string | null
          "alamat": string | null
          "notelepon": string | null
          "fax": string | null
        }
        Insert: {
          "kodekantor": string
          "fungsi"?: string | null
          "namakantor"?: string | null
          "alamat"?: string | null
          "notelepon"?: string | null
          "fax"?: string | null
        }
        Update: {
          "kodekantor"?: string | null
          "fungsi"?: string | null
          "namakantor"?: string | null
          "alamat"?: string | null
          "notelepon"?: string | null
          "fax"?: string | null
        }
        Relationships: []
      }
      "ecommerce_categories": {
        Row: {
          "id": string
          "nama_kategori": string
          "slug": string
          "deskripsi": string | null
          "gambar_url": string | null
          "urutan": number | null
          "created_at": string | null
        }
        Insert: {
          "id"?: string | null
          "nama_kategori": string
          "slug": string
          "deskripsi"?: string | null
          "gambar_url"?: string | null
          "urutan"?: number | null
          "created_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "nama_kategori"?: string | null
          "slug"?: string | null
          "deskripsi"?: string | null
          "gambar_url"?: string | null
          "urutan"?: number | null
          "created_at"?: string | null
        }
        Relationships: []
      }
      "tbl_kaslaci": {
        Row: {
          "nama_user": string
          "shift": string | null
          "kas_awal": number | null
          "kas_masuk": number | null
          "kas_akhir": number | null
          "wkt_mulai": string | null
          "wkt_akhir": string | null
          "login_flag": boolean | null
          "kas_keluar": number | null
          "nama_komputer": string | null
          "notransaksi": string
        }
        Insert: {
          "nama_user": string
          "shift"?: string | null
          "kas_awal"?: number | null
          "kas_masuk"?: number | null
          "kas_akhir"?: number | null
          "wkt_mulai"?: string | null
          "wkt_akhir"?: string | null
          "login_flag"?: boolean | null
          "kas_keluar"?: number | null
          "nama_komputer"?: string | null
          "notransaksi": string
        }
        Update: {
          "nama_user"?: string | null
          "shift"?: string | null
          "kas_awal"?: number | null
          "kas_masuk"?: number | null
          "kas_akhir"?: number | null
          "wkt_mulai"?: string | null
          "wkt_akhir"?: string | null
          "login_flag"?: boolean | null
          "kas_keluar"?: number | null
          "nama_komputer"?: string | null
          "notransaksi"?: string | null
        }
        Relationships: []
      }
      "tbl_itemhj": {
        Row: {
          "iddetail": string
          "kodeitem": string | null
          "tipehj": string | null
          "jmlsampai": number | null
          "level": number | null
          "prosentase": number | null
          "satuan": string | null
          "hargajual": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "kodeitem"?: string | null
          "tipehj"?: string | null
          "jmlsampai"?: number | null
          "level"?: number | null
          "prosentase"?: number | null
          "satuan"?: string | null
          "hargajual"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "kodeitem"?: string | null
          "tipehj"?: string | null
          "jmlsampai"?: number | null
          "level"?: number | null
          "prosentase"?: number | null
          "satuan"?: string | null
          "hargajual"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_matauang": {
        Row: {
          "matauang": string
          "ketmatauang": string | null
          "rate": number | null
          "utama": boolean | null
          "acc_hutang": string | null
          "acc_piutang": string | null
          "acc_byrtunai": string | null
          "acc_byrbank": string | null
          "tipe": string | null
        }
        Insert: {
          "matauang": string
          "ketmatauang"?: string | null
          "rate"?: number | null
          "utama"?: boolean | null
          "acc_hutang"?: string | null
          "acc_piutang"?: string | null
          "acc_byrtunai"?: string | null
          "acc_byrbank"?: string | null
          "tipe"?: string | null
        }
        Update: {
          "matauang"?: string | null
          "ketmatauang"?: string | null
          "rate"?: number | null
          "utama"?: boolean | null
          "acc_hutang"?: string | null
          "acc_piutang"?: string | null
          "acc_byrtunai"?: string | null
          "acc_byrbank"?: string | null
          "tipe"?: string | null
        }
        Relationships: []
      }
      "tbl_item_rekap": {
        Row: {
          "kodeitem": string | null
          "kodekantor": string | null
          "bulan": number | null
          "tahun": number | null
          "satuan": string | null
          "awal": number | null
          "awal_nilai": number | null
          "awal_total": number | null
          "masuk": number | null
          "masuk_nilai": number | null
          "masuk_total": number | null
          "keluar": number | null
          "keluar_nilai": number | null
          "keluar_total": number | null
          "akhir": number | null
          "akhir_nilai": number | null
          "akhir_total": number | null
        }
        Insert: {
          "kodeitem"?: string | null
          "kodekantor"?: string | null
          "bulan"?: number | null
          "tahun"?: number | null
          "satuan"?: string | null
          "awal"?: number | null
          "awal_nilai"?: number | null
          "awal_total"?: number | null
          "masuk"?: number | null
          "masuk_nilai"?: number | null
          "masuk_total"?: number | null
          "keluar"?: number | null
          "keluar_nilai"?: number | null
          "keluar_total"?: number | null
          "akhir"?: number | null
          "akhir_nilai"?: number | null
          "akhir_total"?: number | null
        }
        Update: {
          "kodeitem"?: string | null
          "kodekantor"?: string | null
          "bulan"?: number | null
          "tahun"?: number | null
          "satuan"?: string | null
          "awal"?: number | null
          "awal_nilai"?: number | null
          "awal_total"?: number | null
          "masuk"?: number | null
          "masuk_nilai"?: number | null
          "masuk_total"?: number | null
          "keluar"?: number | null
          "keluar_nilai"?: number | null
          "keluar_total"?: number | null
          "akhir"?: number | null
          "akhir_nilai"?: number | null
          "akhir_total"?: number | null
        }
        Relationships: []
      }
      "tbl_byrpiutangdt": {
        Row: {
          "iddetail": string
          "notransaksi": string | null
          "notrsmasuk": string | null
          "tipe": string | null
          "matauang": string | null
          "ratetrs": number | null
          "jmlkredit": number | null
          "krd_jml_pot": number | null
          "krd_total": number | null
          "krd_jml_byr": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "notransaksi"?: string | null
          "notrsmasuk"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "ratetrs"?: number | null
          "jmlkredit"?: number | null
          "krd_jml_pot"?: number | null
          "krd_total"?: number | null
          "krd_jml_byr"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "notransaksi"?: string | null
          "notrsmasuk"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "ratetrs"?: number | null
          "jmlkredit"?: number | null
          "krd_jml_pot"?: number | null
          "krd_total"?: number | null
          "krd_jml_byr"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_perksetting": {
        Row: {
          "accsetting": string
          "kodeacc": string | null
          "acckantor": string
        }
        Insert: {
          "accsetting": string
          "kodeacc"?: string | null
          "acckantor": string
        }
        Update: {
          "accsetting"?: string | null
          "kodeacc"?: string | null
          "acckantor"?: string | null
        }
        Relationships: []
      }
      "tbl_formatnosp": {
        Row: {
          "trid": string
          "nomor": number | null
          "slot1": string | null
          "slot2": string | null
          "slot3": string | null
          "sep1": string | null
          "sep2": string | null
          "numdgt": number | null
          "lastnom": string | null
        }
        Insert: {
          "trid": string
          "nomor"?: number | null
          "slot1"?: string | null
          "slot2"?: string | null
          "slot3"?: string | null
          "sep1"?: string | null
          "sep2"?: string | null
          "numdgt"?: number | null
          "lastnom"?: string | null
        }
        Update: {
          "trid"?: string | null
          "nomor"?: number | null
          "slot1"?: string | null
          "slot2"?: string | null
          "slot3"?: string | null
          "sep1"?: string | null
          "sep2"?: string | null
          "numdgt"?: number | null
          "lastnom"?: string | null
        }
        Relationships: []
      }
      "tbl_supelgrup": {
        Row: {
          "kgrup": string
          "grup": string | null
          "potongan": number | null
          "levelharga": number | null
        }
        Insert: {
          "kgrup": string
          "grup"?: string | null
          "potongan"?: number | null
          "levelharga"?: number | null
        }
        Update: {
          "kgrup"?: string | null
          "grup"?: string | null
          "potongan"?: number | null
          "levelharga"?: number | null
        }
        Relationships: []
      }
      "tbl_usercus_acc": {
        Row: {
          "klpakses": string | null
          "modulid": string | null
          "customacc": string | null
          "customval": string | null
        }
        Insert: {
          "klpakses"?: string | null
          "modulid"?: string | null
          "customacc"?: string | null
          "customval"?: string | null
        }
        Update: {
          "klpakses"?: string | null
          "modulid"?: string | null
          "customacc"?: string | null
          "customval"?: string | null
        }
        Relationships: []
      }
      "tbl_rj_piutang": {
        Row: {
          "noretur": string | null
          "notrspot": string | null
          "jmlpot": number | null
        }
        Insert: {
          "noretur"?: string | null
          "notrspot"?: string | null
          "jmlpot"?: number | null
        }
        Update: {
          "noretur"?: string | null
          "notrspot"?: string | null
          "jmlpot"?: number | null
        }
        Relationships: []
      }
      "tbl_byrpiutanghd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "tanggal": string | null
          "tipe": string | null
          "kodesupel": string | null
          "matauang": string | null
          "rate": number | null
          "totalbayar": number | null
          "acc_bayar": string | null
          "carabayar": string | null
          "byr_krd_jt": string | null
          "nomor": string | null
          "keterangan": string | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "shiftkerja": string | null
          "stslunas": boolean | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "totalbayar"?: number | null
          "acc_bayar"?: string | null
          "carabayar"?: string | null
          "byr_krd_jt"?: string | null
          "nomor"?: string | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "stslunas"?: boolean | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "totalbayar"?: number | null
          "acc_bayar"?: string | null
          "carabayar"?: string | null
          "byr_krd_jt"?: string | null
          "nomor"?: string | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "stslunas"?: boolean | null
        }
        Relationships: []
      }
      "tbl_itemsatuan": {
        Row: {
          "satuan": string
          "ketsatuan": string | null
          "konversi": number | null
          "satuankonversi": string | null
          "utama": boolean | null
        }
        Insert: {
          "satuan": string
          "ketsatuan"?: string | null
          "konversi"?: number | null
          "satuankonversi"?: string | null
          "utama"?: boolean | null
        }
        Update: {
          "satuan"?: string | null
          "ketsatuan"?: string | null
          "konversi"?: number | null
          "satuankonversi"?: string | null
          "utama"?: boolean | null
        }
        Relationships: []
      }
      "tbl_itemmerek": {
        Row: {
          "merek": string
          "ketmerek": string | null
        }
        Insert: {
          "merek": string
          "ketmerek"?: string | null
        }
        Update: {
          "merek"?: string | null
          "ketmerek"?: string | null
        }
        Relationships: []
      }
      "tbl_itemstok": {
        Row: {
          "kodeitem": string | null
          "kantor": string | null
          "stok": number | null
        }
        Insert: {
          "kodeitem"?: string | null
          "kantor"?: string | null
          "stok"?: number | null
        }
        Update: {
          "kodeitem"?: string | null
          "kantor"?: string | null
          "stok"?: number | null
        }
        Relationships: []
      }
      "tbl_acckasdt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeacc": string | null
          "matauang": string | null
          "rate": number | null
          "jumlah": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeacc"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeacc"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "jumlah"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_pesanhd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kantortujuan": string | null
          "tanggal": string | null
          "tipe": string | null
          "tanggalkirim": string | null
          "jenis": string | null
          "kodesupel": string | null
          "kodesales": string | null
          "kodesales2": string | null
          "kodesales3": string | null
          "kodesales4": string | null
          "matauang": string | null
          "rate": number | null
          "keterangan": string | null
          "komisi1": number | null
          "komisi2": number | null
          "komisi3": number | null
          "komisi4": number | null
          "totalitem": number | null
          "totalterima": number | null
          "subtotal": number | null
          "potfaktur": number | null
          "pajak": number | null
          "biayalain": number | null
          "totalakhir": number | null
          "biaya_msk_total": boolean | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "potnomfaktur": number | null
          "prpajak": number | null
          "dppesanan": number | null
          "dppesananbyr": number | null
          "acc_dppesanan": string | null
          "acc_dpkas": string | null
          "jenis_pajak": string | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "tanggalkirim"?: string | null
          "jenis"?: string | null
          "kodesupel"?: string | null
          "kodesales"?: string | null
          "kodesales2"?: string | null
          "kodesales3"?: string | null
          "kodesales4"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "komisi1"?: number | null
          "komisi2"?: number | null
          "komisi3"?: number | null
          "komisi4"?: number | null
          "totalitem"?: number | null
          "totalterima"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "biaya_msk_total"?: boolean | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "potnomfaktur"?: number | null
          "prpajak"?: number | null
          "dppesanan"?: number | null
          "dppesananbyr"?: number | null
          "acc_dppesanan"?: string | null
          "acc_dpkas"?: string | null
          "jenis_pajak"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "tanggalkirim"?: string | null
          "jenis"?: string | null
          "kodesupel"?: string | null
          "kodesales"?: string | null
          "kodesales2"?: string | null
          "kodesales3"?: string | null
          "kodesales4"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "komisi1"?: number | null
          "komisi2"?: number | null
          "komisi3"?: number | null
          "komisi4"?: number | null
          "totalitem"?: number | null
          "totalterima"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "biaya_msk_total"?: boolean | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "potnomfaktur"?: number | null
          "prpajak"?: number | null
          "dppesanan"?: number | null
          "dppesananbyr"?: number | null
          "acc_dppesanan"?: string | null
          "acc_dpkas"?: string | null
          "jenis_pajak"?: string | null
        }
        Relationships: []
      }
      "tbl_itemdisp": {
        Row: {
          "iddiskon": string
          "kodeitemd": string | null
          "kodeitems": string | null
          "jenis": string | null
          "merek": string | null
          "tgldari": string | null
          "tglsampai": string | null
          "pot1": number | null
          "pot2": number | null
          "pot3": number | null
          "pot4": number | null
          "stsact": boolean | null
          "tipeper": string | null
          "jamdari": string | null
          "jamsampai": string | null
          "w1": boolean | null
          "w2": boolean | null
          "w3": boolean | null
          "w4": boolean | null
          "w5": boolean | null
          "w6": boolean | null
          "w7": boolean | null
          "prioritas": number | null
        }
        Insert: {
          "iddiskon": string
          "kodeitemd"?: string | null
          "kodeitems"?: string | null
          "jenis"?: string | null
          "merek"?: string | null
          "tgldari"?: string | null
          "tglsampai"?: string | null
          "pot1"?: number | null
          "pot2"?: number | null
          "pot3"?: number | null
          "pot4"?: number | null
          "stsact"?: boolean | null
          "tipeper"?: string | null
          "jamdari"?: string | null
          "jamsampai"?: string | null
          "w1"?: boolean | null
          "w2"?: boolean | null
          "w3"?: boolean | null
          "w4"?: boolean | null
          "w5"?: boolean | null
          "w6"?: boolean | null
          "w7"?: boolean | null
          "prioritas"?: number | null
        }
        Update: {
          "iddiskon"?: string | null
          "kodeitemd"?: string | null
          "kodeitems"?: string | null
          "jenis"?: string | null
          "merek"?: string | null
          "tgldari"?: string | null
          "tglsampai"?: string | null
          "pot1"?: number | null
          "pot2"?: number | null
          "pot3"?: number | null
          "pot4"?: number | null
          "stsact"?: boolean | null
          "tipeper"?: string | null
          "jamdari"?: string | null
          "jamsampai"?: string | null
          "w1"?: boolean | null
          "w2"?: boolean | null
          "w3"?: boolean | null
          "w4"?: boolean | null
          "w5"?: boolean | null
          "w6"?: boolean | null
          "w7"?: boolean | null
          "prioritas"?: number | null
        }
        Relationships: []
      }
      "cart_items": {
        Row: {
          "id": string
          "user_id": string
          "kodeitem": string
          "satuan": string
          "jumlah": number
          "created_at": string | null
          "updated_at": string | null
        }
        Insert: {
          "id"?: string | null
          "user_id": string
          "kodeitem": string
          "satuan": string
          "jumlah": number
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "user_id"?: string | null
          "kodeitem"?: string | null
          "satuan"?: string | null
          "jumlah"?: number | null
          "created_at"?: string | null
          "updated_at"?: string | null
        }
        Relationships: []
      }
      "tbl_infodb": {
        Row: {
          "versidb": string | null
          "versiupdate": string | null
        }
        Insert: {
          "versidb"?: string | null
          "versiupdate"?: string | null
        }
        Update: {
          "versidb"?: string | null
          "versiupdate"?: string | null
        }
        Relationships: []
      }
      "tbl_acctmpns": {
        Row: {
          "kodeacc": string | null
          "kelompok": string | null
          "matauang": string | null
          "rate": number | null
          "rdebet": number | null
          "rkredit": number | null
          "debet": number | null
          "kredit": number | null
          "pdebet": number | null
          "pkredit": number | null
          "tdebet": number | null
          "tkredit": number | null
          "lrdebet": number | null
          "lrkredit": number | null
          "ndebet": number | null
          "nkredit": number | null
          "usergen": string | null
        }
        Insert: {
          "kodeacc"?: string | null
          "kelompok"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "rdebet"?: number | null
          "rkredit"?: number | null
          "debet"?: number | null
          "kredit"?: number | null
          "pdebet"?: number | null
          "pkredit"?: number | null
          "tdebet"?: number | null
          "tkredit"?: number | null
          "lrdebet"?: number | null
          "lrkredit"?: number | null
          "ndebet"?: number | null
          "nkredit"?: number | null
          "usergen"?: string | null
        }
        Update: {
          "kodeacc"?: string | null
          "kelompok"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "rdebet"?: number | null
          "rkredit"?: number | null
          "debet"?: number | null
          "kredit"?: number | null
          "pdebet"?: number | null
          "pkredit"?: number | null
          "tdebet"?: number | null
          "tkredit"?: number | null
          "lrdebet"?: number | null
          "lrkredit"?: number | null
          "ndebet"?: number | null
          "nkredit"?: number | null
          "usergen"?: string | null
        }
        Relationships: []
      }
      "payment_proofs": {
        Row: {
          "id": string
          "order_id": string
          "user_id": string
          "file_path": string
          "file_url": string
          "file_name": string | null
          "status_verifikasi": string
          "alasan_penolakan": string | null
          "uploaded_at": string | null
          "verified_by": string | null
          "verified_at": string | null
        }
        Insert: {
          "id"?: string | null
          "order_id": string
          "user_id": string
          "file_path": string
          "file_url": string
          "file_name"?: string | null
          "status_verifikasi": string
          "alasan_penolakan"?: string | null
          "uploaded_at"?: string | null
          "verified_by"?: string | null
          "verified_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "order_id"?: string | null
          "user_id"?: string | null
          "file_path"?: string | null
          "file_url"?: string | null
          "file_name"?: string | null
          "status_verifikasi"?: string | null
          "alasan_penolakan"?: string | null
          "uploaded_at"?: string | null
          "verified_by"?: string | null
          "verified_at"?: string | null
        }
        Relationships: []
      }
      "tbl_itemserial": {
        Row: {
          "noserial": string
          "kodeitem": string | null
          "iddttrsm": string | null
          "notrsm": string | null
          "iddttrsrk": string | null
          "notrsrk": string | null
          "iddtop": string | null
          "notrsop": string | null
          "stsmasuk": string | null
          "stskeluar": string | null
          "stsada": string | null
          "dateupd": string | null
          "kodekantor": string | null
        }
        Insert: {
          "noserial": string
          "kodeitem"?: string | null
          "iddttrsm"?: string | null
          "notrsm"?: string | null
          "iddttrsrk"?: string | null
          "notrsrk"?: string | null
          "iddtop"?: string | null
          "notrsop"?: string | null
          "stsmasuk"?: string | null
          "stskeluar"?: string | null
          "stsada"?: string | null
          "dateupd"?: string | null
          "kodekantor"?: string | null
        }
        Update: {
          "noserial"?: string | null
          "kodeitem"?: string | null
          "iddttrsm"?: string | null
          "notrsm"?: string | null
          "iddttrsrk"?: string | null
          "notrsrk"?: string | null
          "iddtop"?: string | null
          "notrsop"?: string | null
          "stsmasuk"?: string | null
          "stskeluar"?: string | null
          "stsada"?: string | null
          "dateupd"?: string | null
          "kodekantor"?: string | null
        }
        Relationships: []
      }
      "tbl_itemopname": {
        Row: {
          "iddetail": string
          "periode": string | null
          "tanggal": string | null
          "kodeitem": string
          "kodekantor": string | null
          "satuan": string | null
          "jmlsebelum": number | null
          "jmlfisik": number | null
          "jmlselisih": number | null
          "kodeacc": string | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "harga": number | null
          "total": number | null
          "compname": string | null
        }
        Insert: {
          "iddetail": string
          "periode"?: string | null
          "tanggal"?: string | null
          "kodeitem": string
          "kodekantor"?: string | null
          "satuan"?: string | null
          "jmlsebelum"?: number | null
          "jmlfisik"?: number | null
          "jmlselisih"?: number | null
          "kodeacc"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "compname"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "periode"?: string | null
          "tanggal"?: string | null
          "kodeitem"?: string | null
          "kodekantor"?: string | null
          "satuan"?: string | null
          "jmlsebelum"?: number | null
          "jmlfisik"?: number | null
          "jmlselisih"?: number | null
          "kodeacc"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "compname"?: string | null
        }
        Relationships: []
      }
      "tbl_item_sa": {
        Row: {
          "bulan": number | null
          "tahun": number | null
          "iddetailtrs": string | null
          "notransaksi": string | null
          "tipe": string | null
          "kodeitem": string | null
          "tanggal": string | null
          "kodekantor": string | null
          "jumlah": number | null
          "satuan": string | null
          "harga": number | null
          "tgl_trs": string | null
        }
        Insert: {
          "bulan"?: number | null
          "tahun"?: number | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "tanggal"?: string | null
          "kodekantor"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "tgl_trs"?: string | null
        }
        Update: {
          "bulan"?: number | null
          "tahun"?: number | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "tanggal"?: string | null
          "kodekantor"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "tgl_trs"?: string | null
        }
        Relationships: []
      }
      "tbl_pointambil": {
        Row: {
          "notransaksi": string
          "tipe": string | null
          "tanggal": string | null
          "periodetgl1": string | null
          "periodetgl2": string | null
          "jmlambil": number | null
          "kodesupel": string | null
          "keterangan": string | null
        }
        Insert: {
          "notransaksi": string
          "tipe"?: string | null
          "tanggal"?: string | null
          "periodetgl1"?: string | null
          "periodetgl2"?: string | null
          "jmlambil"?: number | null
          "kodesupel"?: string | null
          "keterangan"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "tipe"?: string | null
          "tanggal"?: string | null
          "periodetgl1"?: string | null
          "periodetgl2"?: string | null
          "jmlambil"?: number | null
          "kodesupel"?: string | null
          "keterangan"?: string | null
        }
        Relationships: []
      }
      "ecommerce_order_items": {
        Row: {
          "id": string
          "order_id": string
          "kodeitem": string
          "namaitem": string
          "satuan": string
          "jumlah": number
          "harga_satuan": number
          "subtotal": number
        }
        Insert: {
          "id"?: string | null
          "order_id": string
          "kodeitem": string
          "namaitem": string
          "satuan": string
          "jumlah": number
          "harga_satuan": number
          "subtotal": number
        }
        Update: {
          "id"?: string | null
          "order_id"?: string | null
          "kodeitem"?: string | null
          "namaitem"?: string | null
          "satuan"?: string | null
          "jumlah"?: number | null
          "harga_satuan"?: number | null
          "subtotal"?: number | null
        }
        Relationships: []
      }
      "tbl_settingpel": {
        Row: {
          "ptipe": number | null
          "pkelipatan": number | null
          "pnilaitukar": number | null
          "pmasadari": string | null
          "pmasasampai": string | null
          "pmtukardari": string | null
          "pmtukarsampai": string | null
          "ppotberlaku": number | null
          "mnote1": string | null
          "mnote2": string | null
          "pumumnopoin": boolean | null
        }
        Insert: {
          "ptipe"?: number | null
          "pkelipatan"?: number | null
          "pnilaitukar"?: number | null
          "pmasadari"?: string | null
          "pmasasampai"?: string | null
          "pmtukardari"?: string | null
          "pmtukarsampai"?: string | null
          "ppotberlaku"?: number | null
          "mnote1"?: string | null
          "mnote2"?: string | null
          "pumumnopoin"?: boolean | null
        }
        Update: {
          "ptipe"?: number | null
          "pkelipatan"?: number | null
          "pnilaitukar"?: number | null
          "pmasadari"?: string | null
          "pmasasampai"?: string | null
          "pmtukardari"?: string | null
          "pmtukarsampai"?: string | null
          "ppotberlaku"?: number | null
          "mnote1"?: string | null
          "mnote2"?: string | null
          "pumumnopoin"?: boolean | null
        }
        Relationships: []
      }
      "messages": {
        Row: {
          "id": string
          "conversation_id": string
          "sender_id": string
          "pesan": string
          "dibaca": boolean
          "created_at": string | null
        }
        Insert: {
          "id"?: string | null
          "conversation_id": string
          "sender_id": string
          "pesan": string
          "dibaca": boolean
          "created_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "conversation_id"?: string | null
          "sender_id"?: string | null
          "pesan"?: string | null
          "dibaca"?: boolean | null
          "created_at"?: string | null
        }
        Relationships: []
      }
      "tbl_user": {
        Row: {
          "userid": string
          "nama": string | null
          "password": string | null
          "tipe": string | null
          "loginkantor": string | null
          "kelompok": string | null
          "loginshift": boolean | null
        }
        Insert: {
          "userid": string
          "nama"?: string | null
          "password"?: string | null
          "tipe"?: string | null
          "loginkantor"?: string | null
          "kelompok"?: string | null
          "loginshift"?: boolean | null
        }
        Update: {
          "userid"?: string | null
          "nama"?: string | null
          "password"?: string | null
          "tipe"?: string | null
          "loginkantor"?: string | null
          "kelompok"?: string | null
          "loginshift"?: boolean | null
        }
        Relationships: []
      }
      "tbl_byrhutangdt": {
        Row: {
          "iddetail": string
          "notransaksi": string | null
          "notrsmasuk": string | null
          "tipe": string | null
          "matauang": string | null
          "ratetrs": number | null
          "jmlkredit": number | null
          "krd_jml_pot": number | null
          "krd_total": number | null
          "krd_jml_byr": number | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "notransaksi"?: string | null
          "notrsmasuk"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "ratetrs"?: number | null
          "jmlkredit"?: number | null
          "krd_jml_pot"?: number | null
          "krd_total"?: number | null
          "krd_jml_byr"?: number | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "notransaksi"?: string | null
          "notrsmasuk"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "ratetrs"?: number | null
          "jmlkredit"?: number | null
          "krd_jml_pot"?: number | null
          "krd_total"?: number | null
          "krd_jml_byr"?: number | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_ikrakitan": {
        Row: {
          "iddetail": string
          "iddetailtrs": string | null
          "notransaksi": string | null
          "tipe": string | null
          "kodeitem": string | null
          "kodeitemrakitan": string | null
          "jumlah": number | null
          "satuan": string | null
          "harga": number | null
          "total": number | null
          "jumlahtrs": number | null
          "satuantrs": string | null
          "dateupd": string | null
        }
        Insert: {
          "iddetail": string
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "kodeitemrakitan"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "total"?: number | null
          "jumlahtrs"?: number | null
          "satuantrs"?: string | null
          "dateupd"?: string | null
        }
        Relationships: []
      }
      "tbl_emoney": {
        Row: {
          "kodeprod": string
          "namaprod": string | null
          "acc_prod": string | null
        }
        Insert: {
          "kodeprod": string
          "namaprod"?: string | null
          "acc_prod"?: string | null
        }
        Update: {
          "kodeprod"?: string | null
          "namaprod"?: string | null
          "acc_prod"?: string | null
        }
        Relationships: []
      }
      "tbl_item_im": {
        Row: {
          "iddetail": string
          "iddetailtrs": string | null
          "notransaksi": string | null
          "kodekantor": string | null
          "tanggal": string | null
          "tipe": string | null
          "matauang": string | null
          "rate": number | null
          "kodeitem": string | null
          "jumlahdasar": number | null
          "satuandasar": string | null
          "hargadasar": number | null
          "masuk": number | null
          "keluar": number | null
          "sisa": number | null
          "flagavg": number | null
          "remasuk": number | null
          "rekeluar": number | null
          "tgl_trs": string | null
        }
        Insert: {
          "iddetail": string
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "kodeitem"?: string | null
          "jumlahdasar"?: number | null
          "satuandasar"?: string | null
          "hargadasar"?: number | null
          "masuk"?: number | null
          "keluar"?: number | null
          "sisa"?: number | null
          "flagavg"?: number | null
          "remasuk"?: number | null
          "rekeluar"?: number | null
          "tgl_trs"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "iddetailtrs"?: string | null
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "kodeitem"?: string | null
          "jumlahdasar"?: number | null
          "satuandasar"?: string | null
          "hargadasar"?: number | null
          "masuk"?: number | null
          "keluar"?: number | null
          "sisa"?: number | null
          "flagavg"?: number | null
          "remasuk"?: number | null
          "rekeluar"?: number | null
          "tgl_trs"?: string | null
        }
        Relationships: []
      }
      "tbl_accdeposithd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kodeacc": string | null
          "kodeaccto": string | null
          "tanggal": string | null
          "matauang": string | null
          "rate": number | null
          "tipe": string | null
          "jumlah": number | null
          "keterangan": string | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "shiftkerja": string | null
          "kodesupel": string | null
          "tipetrs": string | null
          "bc_trf_sts": boolean | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kodeacc"?: string | null
          "kodeaccto"?: string | null
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "tipe"?: string | null
          "jumlah"?: number | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "kodesupel"?: string | null
          "tipetrs"?: string | null
          "bc_trf_sts"?: boolean | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kodeacc"?: string | null
          "kodeaccto"?: string | null
          "tanggal"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "tipe"?: string | null
          "jumlah"?: number | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "kodesupel"?: string | null
          "tipetrs"?: string | null
          "bc_trf_sts"?: boolean | null
        }
        Relationships: []
      }
      "tbl_bank": {
        Row: {
          "kodebank": string
          "namabank": string | null
          "acc_kd": string | null
          "acc_kk": string | null
        }
        Insert: {
          "kodebank": string
          "namabank"?: string | null
          "acc_kd"?: string | null
          "acc_kk"?: string | null
        }
        Update: {
          "kodebank"?: string | null
          "namabank"?: string | null
          "acc_kd"?: string | null
          "acc_kk"?: string | null
        }
        Relationships: []
      }
      "tbl_perkiraan": {
        Row: {
          "kodeacc": string
          "parentacc": string | null
          "kelompok": string | null
          "tipe": string | null
          "namaacc": string | null
          "matauang": string | null
          "dateupd": string | null
          "kasbank": boolean | null
          "defmuutm": boolean | null
        }
        Insert: {
          "kodeacc": string
          "parentacc"?: string | null
          "kelompok"?: string | null
          "tipe"?: string | null
          "namaacc"?: string | null
          "matauang"?: string | null
          "dateupd"?: string | null
          "kasbank"?: boolean | null
          "defmuutm"?: boolean | null
        }
        Update: {
          "kodeacc"?: string | null
          "parentacc"?: string | null
          "kelompok"?: string | null
          "tipe"?: string | null
          "namaacc"?: string | null
          "matauang"?: string | null
          "dateupd"?: string | null
          "kasbank"?: boolean | null
          "defmuutm"?: boolean | null
        }
        Relationships: []
      }
      "tbl_imdt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeitem": string | null
          "jumlah": number | null
          "jmlpesan": number | null
          "satuan": string | null
          "harga": number | null
          "potongan": number | null
          "total": number | null
          "pajak": number | null
          "jmlrmasuk": number | null
          "jmlkeluar": number | null
          "jmlrkeluar": number | null
          "jmlsisa": number | null
          "jmlkonsibayar": number | null
          "tglexp": string | null
          "kodeprod": string | null
          "idorder": string | null
          "dateupd": string | null
          "sakantor": string | null
          "idtrsretur": string | null
          "jmlretur": number | null
          "detinfo": string | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlpesan"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "jmlrmasuk"?: number | null
          "jmlkeluar"?: number | null
          "jmlrkeluar"?: number | null
          "jmlsisa"?: number | null
          "jmlkonsibayar"?: number | null
          "tglexp"?: string | null
          "kodeprod"?: string | null
          "idorder"?: string | null
          "dateupd"?: string | null
          "sakantor"?: string | null
          "idtrsretur"?: string | null
          "jmlretur"?: number | null
          "detinfo"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlpesan"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "jmlrmasuk"?: number | null
          "jmlkeluar"?: number | null
          "jmlrkeluar"?: number | null
          "jmlsisa"?: number | null
          "jmlkonsibayar"?: number | null
          "tglexp"?: string | null
          "kodeprod"?: string | null
          "idorder"?: string | null
          "dateupd"?: string | null
          "sakantor"?: string | null
          "idtrsretur"?: string | null
          "jmlretur"?: number | null
          "detinfo"?: string | null
        }
        Relationships: []
      }
      "tbl_mu_ratesa": {
        Row: {
          "matauang": string | null
          "tanggal": string | null
          "rate": number | null
        }
        Insert: {
          "matauang"?: string | null
          "tanggal"?: string | null
          "rate"?: number | null
        }
        Update: {
          "matauang"?: string | null
          "tanggal"?: string | null
          "rate"?: number | null
        }
        Relationships: []
      }
      "tbl_itrhd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kantordari": string | null
          "kantortujuan": string | null
          "tanggal": string | null
          "tipe": string | null
          "keterangan": string | null
          "acc_persediaan": string | null
          "totalitem": number | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "shiftkerja": string | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kantordari"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "keterangan"?: string | null
          "acc_persediaan"?: string | null
          "totalitem"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kantordari"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "keterangan"?: string | null
          "acc_persediaan"?: string | null
          "totalitem"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
        }
        Relationships: []
      }
      "tbl_sandi": {
        Row: {
          "angka": string | null
          "huruf": string | null
        }
        Insert: {
          "angka"?: string | null
          "huruf"?: string | null
        }
        Update: {
          "angka"?: string | null
          "huruf"?: string | null
        }
        Relationships: []
      }
      "tbl_byrhutanghd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "tanggal": string | null
          "tipe": string | null
          "kodesupel": string | null
          "matauang": string | null
          "rate": number | null
          "totalbayar": number | null
          "acc_bayar": string | null
          "carabayar": string | null
          "byr_krd_jt": string | null
          "nomor": string | null
          "keterangan": string | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "shiftkerja": string | null
          "stslunas": boolean | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "totalbayar"?: number | null
          "acc_bayar"?: string | null
          "carabayar"?: string | null
          "byr_krd_jt"?: string | null
          "nomor"?: string | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "stslunas"?: boolean | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "totalbayar"?: number | null
          "acc_bayar"?: string | null
          "carabayar"?: string | null
          "byr_krd_jt"?: string | null
          "nomor"?: string | null
          "keterangan"?: string | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "shiftkerja"?: string | null
          "stslunas"?: boolean | null
        }
        Relationships: []
      }
      "tbl_itemjenis": {
        Row: {
          "jenis": string
          "ketjenis": string | null
        }
        Insert: {
          "jenis": string
          "ketjenis"?: string | null
        }
        Update: {
          "jenis"?: string | null
          "ketjenis"?: string | null
        }
        Relationships: []
      }
      "tbl_userakses": {
        Row: {
          "klpakses": string | null
          "modulid": string | null
          "mopen": boolean | null
          "mnew": boolean | null
          "medit": boolean | null
          "mdel": boolean | null
          "mlock": boolean | null
          "urut": number | null
          "kelompok": number | null
        }
        Insert: {
          "klpakses"?: string | null
          "modulid"?: string | null
          "mopen"?: boolean | null
          "mnew"?: boolean | null
          "medit"?: boolean | null
          "mdel"?: boolean | null
          "mlock"?: boolean | null
          "urut"?: number | null
          "kelompok"?: number | null
        }
        Update: {
          "klpakses"?: string | null
          "modulid"?: string | null
          "mopen"?: boolean | null
          "mnew"?: boolean | null
          "medit"?: boolean | null
          "mdel"?: boolean | null
          "mlock"?: boolean | null
          "urut"?: number | null
          "kelompok"?: number | null
        }
        Relationships: []
      }
      "tbl_ikdt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeitem": string | null
          "jumlah": number | null
          "jmlpesan": number | null
          "satuan": string | null
          "harga": number | null
          "potongan": number | null
          "potongan2": number | null
          "potongan3": number | null
          "potongan4": number | null
          "total": number | null
          "pajak": number | null
          "jmlrmasuk": number | null
          "jmlkeluar": number | null
          "jmlrkeluar": number | null
          "jmlsisa": number | null
          "jmlkonsibayar": number | null
          "idorder": string | null
          "dateupd": string | null
          "idtrsretur": string | null
          "jmlretur": number | null
          "detinfo": string | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlpesan"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "potongan2"?: number | null
          "potongan3"?: number | null
          "potongan4"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "jmlrmasuk"?: number | null
          "jmlkeluar"?: number | null
          "jmlrkeluar"?: number | null
          "jmlsisa"?: number | null
          "jmlkonsibayar"?: number | null
          "idorder"?: string | null
          "dateupd"?: string | null
          "idtrsretur"?: string | null
          "jmlretur"?: number | null
          "detinfo"?: string | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "jmlpesan"?: number | null
          "satuan"?: string | null
          "harga"?: number | null
          "potongan"?: number | null
          "potongan2"?: number | null
          "potongan3"?: number | null
          "potongan4"?: number | null
          "total"?: number | null
          "pajak"?: number | null
          "jmlrmasuk"?: number | null
          "jmlkeluar"?: number | null
          "jmlrkeluar"?: number | null
          "jmlsisa"?: number | null
          "jmlkonsibayar"?: number | null
          "idorder"?: string | null
          "dateupd"?: string | null
          "idtrsretur"?: string | null
          "jmlretur"?: number | null
          "detinfo"?: string | null
        }
        Relationships: []
      }
      "tbl_itemsatuanjml": {
        Row: {
          "iddetail": string
          "kodeitem": string | null
          "satuan": string | null
          "jumlahkonv": number | null
          "hargapokok": number | null
          "tipe": string | null
          "dateupd": string | null
          "komisisales": number | null
        }
        Insert: {
          "iddetail": string
          "kodeitem"?: string | null
          "satuan"?: string | null
          "jumlahkonv"?: number | null
          "hargapokok"?: number | null
          "tipe"?: string | null
          "dateupd"?: string | null
          "komisisales"?: number | null
        }
        Update: {
          "iddetail"?: string | null
          "kodeitem"?: string | null
          "satuan"?: string | null
          "jumlahkonv"?: number | null
          "hargapokok"?: number | null
          "tipe"?: string | null
          "dateupd"?: string | null
          "komisisales"?: number | null
        }
        Relationships: []
      }
      "tbl_item_ik": {
        Row: {
          "iddetailim": string | null
          "notransaksi": string | null
          "kodekantor": string | null
          "tanggal": string | null
          "tipe": string | null
          "kodeitem": string | null
          "jumlahdasar": number | null
          "satuandasar": string | null
          "hargadasar": number | null
          "iddetailtrs": string | null
        }
        Insert: {
          "iddetailim"?: string | null
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "jumlahdasar"?: number | null
          "satuandasar"?: string | null
          "hargadasar"?: number | null
          "iddetailtrs"?: string | null
        }
        Update: {
          "iddetailim"?: string | null
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "kodeitem"?: string | null
          "jumlahdasar"?: number | null
          "satuandasar"?: string | null
          "hargadasar"?: number | null
          "iddetailtrs"?: string | null
        }
        Relationships: []
      }
      "tbl_imhd": {
        Row: {
          "notransaksi": string
          "kodekantor": string | null
          "kantortujuan": string | null
          "tanggal": string | null
          "tipe": string | null
          "notrsorder": string | null
          "kodesupel": string | null
          "matauang": string | null
          "rate": number | null
          "keterangan": string | null
          "totalitem": number | null
          "totalitempesan": number | null
          "subtotal": number | null
          "potfaktur": number | null
          "pajak": number | null
          "biayalain": number | null
          "totalakhir": number | null
          "carabayar": string | null
          "jmltunai": number | null
          "jmlkredit": number | null
          "acc_potongan": string | null
          "acc_pajak": string | null
          "acc_biayalain": string | null
          "acc_tunai": string | null
          "acc_kredit": string | null
          "acc_hpp": string | null
          "byr_krd_jt": string | null
          "byr_krd_no": string | null
          "krd_jml_pot": number | null
          "krd_jml_byr": number | null
          "user1": string | null
          "user2": string | null
          "dateupd": string | null
          "tanggal_sa": string | null
          "biaya_msk_total": boolean | null
          "potnomfaktur": number | null
          "compname": string | null
          "shiftkerja": string | null
          "acc_biaya_pot": string | null
          "prpajak": number | null
          "dppesanan": number | null
          "acc_dppesanan": string | null
          "notrsretur": string | null
          "jmldeposit": number | null
          "acc_deposit": string | null
          "jenis_pajak": string | null
        }
        Insert: {
          "notransaksi": string
          "kodekantor"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "notrsorder"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "totalitem"?: number | null
          "totalitempesan"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "carabayar"?: string | null
          "jmltunai"?: number | null
          "jmlkredit"?: number | null
          "acc_potongan"?: string | null
          "acc_pajak"?: string | null
          "acc_biayalain"?: string | null
          "acc_tunai"?: string | null
          "acc_kredit"?: string | null
          "acc_hpp"?: string | null
          "byr_krd_jt"?: string | null
          "byr_krd_no"?: string | null
          "krd_jml_pot"?: number | null
          "krd_jml_byr"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "tanggal_sa"?: string | null
          "biaya_msk_total"?: boolean | null
          "potnomfaktur"?: number | null
          "compname"?: string | null
          "shiftkerja"?: string | null
          "acc_biaya_pot"?: string | null
          "prpajak"?: number | null
          "dppesanan"?: number | null
          "acc_dppesanan"?: string | null
          "notrsretur"?: string | null
          "jmldeposit"?: number | null
          "acc_deposit"?: string | null
          "jenis_pajak"?: string | null
        }
        Update: {
          "notransaksi"?: string | null
          "kodekantor"?: string | null
          "kantortujuan"?: string | null
          "tanggal"?: string | null
          "tipe"?: string | null
          "notrsorder"?: string | null
          "kodesupel"?: string | null
          "matauang"?: string | null
          "rate"?: number | null
          "keterangan"?: string | null
          "totalitem"?: number | null
          "totalitempesan"?: number | null
          "subtotal"?: number | null
          "potfaktur"?: number | null
          "pajak"?: number | null
          "biayalain"?: number | null
          "totalakhir"?: number | null
          "carabayar"?: string | null
          "jmltunai"?: number | null
          "jmlkredit"?: number | null
          "acc_potongan"?: string | null
          "acc_pajak"?: string | null
          "acc_biayalain"?: string | null
          "acc_tunai"?: string | null
          "acc_kredit"?: string | null
          "acc_hpp"?: string | null
          "byr_krd_jt"?: string | null
          "byr_krd_no"?: string | null
          "krd_jml_pot"?: number | null
          "krd_jml_byr"?: number | null
          "user1"?: string | null
          "user2"?: string | null
          "dateupd"?: string | null
          "tanggal_sa"?: string | null
          "biaya_msk_total"?: boolean | null
          "potnomfaktur"?: number | null
          "compname"?: string | null
          "shiftkerja"?: string | null
          "acc_biaya_pot"?: string | null
          "prpajak"?: number | null
          "dppesanan"?: number | null
          "acc_dppesanan"?: string | null
          "notrsretur"?: string | null
          "jmldeposit"?: number | null
          "acc_deposit"?: string | null
          "jenis_pajak"?: string | null
        }
        Relationships: []
      }
      "conversations": {
        Row: {
          "id": string
          "customer_id": string
          "order_id": string | null
          "last_message_at": string | null
          "created_at": string | null
        }
        Insert: {
          "id"?: string | null
          "customer_id": string
          "order_id"?: string | null
          "last_message_at"?: string | null
          "created_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "customer_id"?: string | null
          "order_id"?: string | null
          "last_message_at"?: string | null
          "created_at"?: string | null
        }
        Relationships: []
      }
      "tbl_itrdt": {
        Row: {
          "iddetail": string
          "nobaris": number | null
          "notransaksi": string | null
          "kodeitem": string | null
          "jumlah": number | null
          "satuan": string | null
          "dateupd": string | null
          "detinfo": string | null
          "harga": number | null
          "total": number | null
        }
        Insert: {
          "iddetail": string
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "dateupd"?: string | null
          "detinfo"?: string | null
          "harga"?: number | null
          "total"?: number | null
        }
        Update: {
          "iddetail"?: string | null
          "nobaris"?: number | null
          "notransaksi"?: string | null
          "kodeitem"?: string | null
          "jumlah"?: number | null
          "satuan"?: string | null
          "dateupd"?: string | null
          "detinfo"?: string | null
          "harga"?: number | null
          "total"?: number | null
        }
        Relationships: []
      }
      "audit_logs": {
        Row: {
          "id": string
          "actor_id": string | null
          "actor_role": string | null
          "action": string
          "target": string | null
          "metadata": unknown | null
          "ip_address": string | null
          "created_at": string | null
        }
        Insert: {
          "id"?: string | null
          "actor_id"?: string | null
          "actor_role"?: string | null
          "action": string
          "target"?: string | null
          "metadata"?: unknown | null
          "ip_address"?: string | null
          "created_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "actor_id"?: string | null
          "actor_role"?: string | null
          "action"?: string | null
          "target"?: string | null
          "metadata"?: unknown | null
          "ip_address"?: string | null
          "created_at"?: string | null
        }
        Relationships: []
      }
      "ecommerce_product_categories": {
        Row: {
          "id": string
          "kodeitem": string
          "category_id": string
          "created_at": string | null
        }
        Insert: {
          "id"?: string | null
          "kodeitem": string
          "category_id": string
          "created_at"?: string | null
        }
        Update: {
          "id"?: string | null
          "kodeitem"?: string | null
          "category_id"?: string | null
          "created_at"?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
