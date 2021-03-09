package com.school.situation;

/**
 * @author jh
 * @version 1.0
 * @className Test
 * @date 2020/06/22 下午12:43
 * @description //
 * @program dream-dsfa
 */


public class Test {

    public static void main(String[] args) {
        System.out.println (isNumeric_2 ("10.0"));
    }


    public static boolean isNumeric_1(String str) {
        for (int i = str.length (); --i >= 0; ) {
            int chr = str.charAt (i);
            if (chr < 48 || chr > 57) {
                return false;
            }
        }
        return true;
    }


    public static boolean isNumeric_2(String str) {
        try {
            Integer.parseInt (str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
