//
//  CALayer+XibConfigLayer.h
//  telehealth
//
//  Created by Hung Cao Thanh on 9/18/14.
//  Copyright (c) 2014 REDiMED. All rights reserved.
//

#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>

@interface CALayer (XibConfigLayer)
// This assigns a CGColor to borderColor.
@property(nonatomic, assign) UIColor* borderUIColor;

//@property (nonatomic) CGFloat borderUIWidth;
@end
