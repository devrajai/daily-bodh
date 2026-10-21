# Keep kotlinx.serialization generated serializers.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class kotlinx.serialization.json.** { *; }
-keep,includedescriptorclasses class com.dailybodh.app.**$$serializer { *; }
-keepclassmembers class com.dailybodh.app.** {
    *** Companion;
}
-keepclasseswithmembers class com.dailybodh.app.** {
    kotlinx.serialization.KSerializer serializer(...);
}
